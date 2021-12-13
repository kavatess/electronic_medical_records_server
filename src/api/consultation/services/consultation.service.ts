import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/hooks/database/base.service";
import { ConsultationDto } from "../dto/consultation.dto";
import {
  Consultation,
  ConsultationDocument,
} from "../schemas/consultation.schema";

@Injectable()
export class ConsultationService extends BaseService<ConsultationDocument> {
  constructor(
    @InjectModel(Consultation.name)
    private readonly consultationModel: Model<ConsultationDocument>
  ) {
    super(consultationModel);
  }

  async getExistedConsultations(
    { _id, provider, patient }: ConsultationDto,
    queryOpts: Record<string, any>
  ): Promise<ConsultationDocument[]> {
    return await this.consultationModel.find({
      provider,
      patient,
      state: { $in: ["INCONSULTATION", "WAITING"] },
      _id: { $ne: _id },
      ...queryOpts,
    });
  }

  async aggregate(pipeline: any[]): Promise<any[]> {
    return await this.consultationModel.aggregate(pipeline);
  }
}
