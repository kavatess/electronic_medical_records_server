import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CreateConsultationService } from "src/api/consultation/models/create-consultation.service.model";
import { Model } from "mongoose";
import { CreateHomeTreatmentDto } from "../dto/create-home-treatment.dto";
import { HomeTreatmentHookService } from "./home-treatment-hook.service";
import { HomeTreatment } from "../schemas/home-treatment.schema";
import { HomeTreatmentBaseErrMsg } from "../home-treatment.constant";

@Injectable()
export class CreateHomeTreatmentService implements CreateConsultationService {
  constructor(
    @InjectModel("home-treatment")
    private readonly homeTreatmentModel: Model<HomeTreatment>,
    private readonly hookService: HomeTreatmentHookService
  ) {}

  async create(
    homeTreatment: CreateHomeTreatmentDto,
    xAuthUser?: string
  ): Promise<HomeTreatment> {
    await Promise.all([
      this.hookService.validateExistedProvider(homeTreatment, {
        baseErrMsg: HomeTreatmentBaseErrMsg.CREATE,
      }),
      this.hookService.validateUserPatientRelationship(homeTreatment, {
        baseErrMsg: HomeTreatmentBaseErrMsg.CREATE,
      }),
      this.hookService.validateIfConsultationExisted(homeTreatment, {
        baseErrMsg: HomeTreatmentBaseErrMsg.CREATE,
      }),
    ]);

    const newHomeTreatment = new this.homeTreatmentModel();
    newHomeTreatment.set({
      ...homeTreatment,
      createdBy: xAuthUser,
      updatedBy: xAuthUser,
    });

    await Promise.all([
      this.hookService.createShortlink(newHomeTreatment),
      this.hookService.createConversation(newHomeTreatment),
      this.hookService.createProviderPatientRelationship(newHomeTreatment),
    ]);

    return await newHomeTreatment.save();
  }
}
