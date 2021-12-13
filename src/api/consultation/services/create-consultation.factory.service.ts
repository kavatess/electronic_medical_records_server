import { Injectable } from "@nestjs/common";
import { CreateHomeTreatmentService } from "../discriminators/home-treatment/services/create-home-treatment.service";
import { CreateIndepthService } from "../discriminators/indepth/services/create-indepth.service";
import { CreateQuestionService } from "../discriminators/question/services/create-question.service";
import { CreateConsultationService } from "../models/create-consultation.service.model";

@Injectable()
export class CreateConsultationFactoryService {
  constructor(
    private readonly createIndepthService: CreateIndepthService,
    private readonly createQuestionService: CreateQuestionService,
    private readonly createHomeTreatmentService: CreateHomeTreatmentService
  ) {}

  public getService(consultType: string): CreateConsultationService {
    if (consultType === "question") {
      return this.createQuestionService;
    }
    if (consultType === "home-treatment") {
      return this.createHomeTreatmentService;
    }
    return this.createIndepthService;
  }
}
