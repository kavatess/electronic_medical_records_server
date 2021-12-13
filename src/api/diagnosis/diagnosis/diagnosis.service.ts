import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/hooks/database/base.service";
import { Diagnosis, DiagnosisDocument } from "./schemas/diagnosis.schema";

@Injectable()
export class DiagnosisService extends BaseService<DiagnosisDocument> {
  constructor(
    @InjectModel(Diagnosis.name)
    private readonly diagnosisModel: Model<DiagnosisDocument>
  ) {
    super(diagnosisModel);
  }
}
