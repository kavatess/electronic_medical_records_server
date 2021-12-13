import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateConsultationService } from "src/api/consultation/models/create-consultation.service.model";
import { CreateIndepthDto } from "../dto/create-indepth.dto";
import { IndepthHookService } from "./indepth-hook.service";
import { Indepth, IndepthDocument } from "../schemas/indepth.schema";
import { IndepthBaseErrMsg } from "../indepth.constant";

@Injectable()
export class CreateIndepthService implements CreateConsultationService {
  constructor(
    @InjectModel("indepth")
    private readonly indepthModel: Model<IndepthDocument>,
    private readonly hookService: IndepthHookService
  ) {}

  async create(
    indepth: CreateIndepthDto,
    xAuthUser?: string
  ): Promise<Indepth> {
    await Promise.all([
      this.hookService.validateExistedProvider(indepth, {
        baseErrMsg: IndepthBaseErrMsg.CREATE,
      }),
      this.hookService.validateUserPatientRelationship(indepth, {
        baseErrMsg: IndepthBaseErrMsg.CREATE,
      }),
      this.hookService.validateIfConsultationExisted(indepth, {
        baseErrMsg: IndepthBaseErrMsg.CREATE,
      }),
    ]);

    const newIndepth = new this.indepthModel();
    newIndepth.set({
      ...indepth,
      createdBy: xAuthUser,
      updatedBy: xAuthUser,
    });

    await Promise.all([
      this.hookService.createShortlink(newIndepth),
      this.hookService.createConversation(newIndepth),
      this.hookService.createProviderPatientRelationship(newIndepth),
    ]);

    return await newIndepth.save();
  }
}
