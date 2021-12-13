import { Injectable, MethodNotAllowedException } from "@nestjs/common";
import { IndepthHookService } from "./indepth-hook.service";
import { Indepth } from "../schemas/indepth.schema";
import {
  IndepthBaseErrMsg,
  UPDATE_INDEPTH_BY_PATIENT_STATE_ENUM,
} from "../indepth.constant";
import { UpdateIndepthByPatientDto } from "../dto/update-indepth-by-patient.dto";
import { UpdateIndepthByProviderDto } from "../dto/update-indepth-by-provider";
import { IndepthService } from "./indepth.service";

@Injectable()
export class UpdateIndepthService {
  constructor(
    private readonly service: IndepthService,
    private readonly hookService: IndepthHookService
  ) {}

  async updateIndepthByPatient(
    indepthId: string,
    { chiefComplaint, reason, questions }: UpdateIndepthByPatientDto,
    xAuthUser: string
  ): Promise<Indepth> {
    const indepth = await this.service.getDocumentById(indepthId, {
      baseErrMsg: IndepthBaseErrMsg.UPDATE_INDEPTH_BY_PATIENT,
    });

    await this.hookService.validateIfxAuthUserIsPatientOrAdmin(
      indepth,
      xAuthUser,
      {
        baseErrMsg: IndepthBaseErrMsg.UPDATE_INDEPTH_BY_PATIENT,
      }
    );

    if (!UPDATE_INDEPTH_BY_PATIENT_STATE_ENUM.includes(indepth.get("state"))) {
      throw new MethodNotAllowedException(
        `${IndepthBaseErrMsg.UPDATE_INDEPTH_BY_PATIENT}: Cannot update indepth(${indepthId}) with state(${indepth.state})`
      );
    }

    if (questions && questions.length) {
      await indepth
        .update({
          $addToSet: {
            indepths: {
              $each: questions,
            },
          },
        })
        .exec();
    }

    indepth.set({ chiefComplaint, reason });
    return await indepth.save();
  }

  async updateIndepthByProvider(
    indepthId: string,
    { note, symptom }: UpdateIndepthByProviderDto,
    xAuthUser: string
  ): Promise<Indepth> {
    const indepth = await this.service.getDocumentById(indepthId, {
      baseErrMsg: IndepthBaseErrMsg.UPDATE_INDEPTH_BY_PROVIDER,
    });

    await this.hookService.validateIfxAuthUserIsProviderOrAdmin(
      indepth,
      xAuthUser,
      {
        baseErrMsg: IndepthBaseErrMsg.UPDATE_INDEPTH_BY_PROVIDER,
      }
    );

    if (indepth.state !== "INCONSULATION") {
      throw new MethodNotAllowedException(
        `${IndepthBaseErrMsg.UPDATE_INDEPTH_BY_PROVIDER}: Indepth must have "INCONSULTATION" state`
      );
    }

    indepth.set({ note, symptom });
    return await indepth.save();
  }
}
