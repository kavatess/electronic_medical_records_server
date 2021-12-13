import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/hooks/database/base.service";
import { MongodbQueryOptions } from "src/models/mongodb-query-options.model";
import { Drug, DrugDocument } from "./schemas/drug.schema";

export class SearchDrugResult {
  total: number;
  data: Drug[];
}

@Injectable()
export class DrugService extends BaseService<DrugDocument> {
  constructor(
    @InjectModel(Drug.name)
    private readonly drugModel: Model<DrugDocument>
  ) {
    super(drugModel);
  }

  async searchDrugs(
    drugName: string,
    drugFilter: Record<string, any>,
    { skip, limit, sort, fields }: MongodbQueryOptions
  ): Promise<SearchDrugResult> {
    drugFilter = {
      name: {
        $regex: drugName,
        $options: "i",
      },
      ...drugFilter,
    };
    const [drugCount, drugArr] = await Promise.all([
      this.countDocuments(drugFilter),
      this.drugModel.find(drugFilter, fields, { skip, limit, sort }),
    ]);

    return {
      total: drugCount,
      data: drugArr,
    };
  }
}
