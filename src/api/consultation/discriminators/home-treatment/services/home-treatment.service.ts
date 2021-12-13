import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/hooks/database/base.service";
import { HomeTreatmentDocument } from "../schemas/home-treatment.schema";

@Injectable()
export class HomeTreatmentService extends BaseService<HomeTreatmentDocument> {
  constructor(
    @InjectModel("home-treatment")
    private readonly homeTreatmentModel: Model<HomeTreatmentDocument>
  ) {
    super(homeTreatmentModel);
  }
}
