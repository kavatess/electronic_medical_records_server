import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/hooks/database/base.service";
import {
  MedicalReference,
  MedicalReferenceDocument,
} from "./schemas/medical-reference.schema";

@Injectable()
export class MedicalReferenceService extends BaseService<MedicalReferenceDocument> {
  constructor(
    @InjectModel(MedicalReference.name)
    private readonly medicalreferenceModel: Model<MedicalReferenceDocument>
  ) {
    super(medicalreferenceModel);
  }
}
