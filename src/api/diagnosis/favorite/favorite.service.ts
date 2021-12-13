import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/hooks/database/base.service";
import { DiagnosisService } from "../diagnosis/diagnosis.service";
import { Favorite, FavoriteDocument } from "./schemas/favorite.schema";

@Injectable()
export class FavoriteService extends BaseService<FavoriteDocument> {
  constructor(
    @InjectModel(Favorite.name)
    private readonly favoriteModel: Model<FavoriteDocument>,
    private readonly diagnosisService: DiagnosisService
  ) {
    super(favoriteModel);
  }

  // add diagnosis to favorite if new
  async createFavoriteDiagnosis(
    providerUser: string,
    diagnosisIdArr: string[]
  ): Promise<FavoriteDocument[]> {
    const diagnosisArr = await this.diagnosisService.find(
      {
        _id: {
          $in: diagnosisIdArr,
        },
      },
      "name slug"
    );
    return await Promise.all(
      diagnosisArr.map((diag) => {
        return this.findOneOrCreate({
          user: providerUser,
          type: "diagnosis",
          value: JSON.stringify(diag),
        });
      })
    );
  }
}
