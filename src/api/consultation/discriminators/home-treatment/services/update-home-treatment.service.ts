import { Injectable, MethodNotAllowedException } from "@nestjs/common";
import { HomeTreatmentHookService } from "./home-treatment-hook.service";
import { HomeTreatment } from "../schemas/home-treatment.schema";
import {
  HomeTreatmentBaseErrMsg,
  UPDATE_HOME_TREATMENT_BY_PATIENT_STATE_ENUM,
} from "../home-treatment.constant";
import { UpdateHomeTreatmentByPatientDto } from "../dto/update-home-treatment-by-patient.dto";
import { UpdateHomeTreatmentByProviderDto } from "../dto/update-home-treatment-by-provider";
import { HomeTreatmentService } from "./home-treatment.service";

@Injectable()
export class UpdateHomeTreatmentService {
  constructor(
    private readonly service: HomeTreatmentService,
    private readonly hookService: HomeTreatmentHookService
  ) {}

  async updateHomeTreatmentByPatient(
    indepthId: string,
    { chiefComplaint, reason, questions }: UpdateHomeTreatmentByPatientDto,
    xAuthUser: string
  ): Promise<HomeTreatment> {
    const indepth = await this.service.getDocumentById(indepthId, {
      baseErrMsg: HomeTreatmentBaseErrMsg.UPDATE_HOME_TREATMENT_BY_PATIENT,
    });

    await this.hookService.validateIfxAuthUserIsPatientOrAdmin(
      indepth,
      xAuthUser,
      {
        baseErrMsg: HomeTreatmentBaseErrMsg.UPDATE_HOME_TREATMENT_BY_PATIENT,
      }
    );

    if (
      !UPDATE_HOME_TREATMENT_BY_PATIENT_STATE_ENUM.includes(
        indepth.get("state")
      )
    ) {
      throw new MethodNotAllowedException(
        `${HomeTreatmentBaseErrMsg.UPDATE_HOME_TREATMENT_BY_PATIENT}: Cannot update indepth(${indepthId}) with state(${indepth.state})`
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

  async updateHomeTreatmentByProvider(
    indepthId: string,
    { note, symptom }: UpdateHomeTreatmentByProviderDto,
    xAuthUser: string
  ): Promise<HomeTreatment> {
    const indepth = await this.service.getDocumentById(indepthId, {
      baseErrMsg: HomeTreatmentBaseErrMsg.UPDATE_HOME_TREATMENT_BY_PROVIDER,
    });

    await this.hookService.validateIfxAuthUserIsProviderOrAdmin(
      indepth,
      xAuthUser,
      {
        baseErrMsg: HomeTreatmentBaseErrMsg.UPDATE_HOME_TREATMENT_BY_PROVIDER,
      }
    );

    if (indepth.state !== "INCONSULATION") {
      throw new MethodNotAllowedException(
        `${HomeTreatmentBaseErrMsg.UPDATE_HOME_TREATMENT_BY_PROVIDER}: Indepth must have "INCONSULTATION" state`
      );
    }

    indepth.set({ note, symptom });
    return await indepth.save();
  }
}
