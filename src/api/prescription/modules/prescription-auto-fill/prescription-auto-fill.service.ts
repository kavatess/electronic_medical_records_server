import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/hooks/database/base.service";
import {
  PrescriptionAutoFill,
  PrescriptionAutoFillDocument,
} from "./schemas/prescription-auto-fill.schema";

@Injectable()
export class PrescriptionAutoFillService extends BaseService<PrescriptionAutoFillDocument> {
  constructor(
    @InjectModel(PrescriptionAutoFill.name)
    private readonly prescriptionautofillModel: Model<PrescriptionAutoFillDocument>
  ) {
    super(prescriptionautofillModel);
  }
}
