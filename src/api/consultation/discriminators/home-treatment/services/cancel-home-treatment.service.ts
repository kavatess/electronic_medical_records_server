import { Injectable } from "@nestjs/common";
import { HomeTreatmentService } from "./home-treatment.service";
import { HomeTreatmentHookService } from "./home-treatment-hook.service";
import { HomeTreatment } from "../schemas/home-treatment.schema";
import { HomeTreatmentBaseErrMsg } from "../home-treatment.constant";
import { RejectHomeTreatmentDto } from "../dto/reject-home-treatment.dto";
import { CancelHomeTreatmentDto } from "../dto/cancel-home-treatment.dto";

@Injectable()
export class CancelHomeTreatmentService {
  constructor(
    private readonly service: HomeTreatmentService,
    private readonly hookService: HomeTreatmentHookService
  ) {}

  async reject(
    homeTreatmentId: string,
    rejectReason: RejectHomeTreatmentDto,
    xAuthUser: string
  ): Promise<HomeTreatment> {
    const homeTreatment = await this.service.getDocumentById(homeTreatmentId, {
      baseErrMsg: HomeTreatmentBaseErrMsg.REJECT,
    });

    const [state, role] = await Promise.all([
      this.hookService.validateStateFlow(homeTreatment, "REJECTED", {
        baseErrMsg: HomeTreatmentBaseErrMsg.REJECT,
      }),
      this.hookService.validateIfxAuthUserIsProviderOrAdmin(
        homeTreatment,
        xAuthUser,
        {
          baseErrMsg: HomeTreatmentBaseErrMsg.REJECT,
        }
      ),
    ]);

    homeTreatment.set({
      state,
      cancelledBy: {
        role,
        user: xAuthUser,
        ...rejectReason,
      },
      updatedBy: xAuthUser,
    });
    return await homeTreatment.save();
  }

  async cancel(
    homeTreatmentId: string,
    cancelReason: CancelHomeTreatmentDto,
    xAuthUser: string
  ): Promise<HomeTreatment> {
    const homeTreatment = await this.service.getDocumentById(homeTreatmentId, {
      baseErrMsg: HomeTreatmentBaseErrMsg.CANCEL,
    });

    const [state, role] = await Promise.all([
      this.hookService.validateStateFlow(homeTreatment, "CANCELLED", {
        baseErrMsg: HomeTreatmentBaseErrMsg.CANCEL,
      }),
      this.hookService.validateIfxAuthUserIsPatientOrAdmin(
        homeTreatment,
        xAuthUser,
        {
          baseErrMsg: HomeTreatmentBaseErrMsg.CANCEL,
        }
      ),
    ]);

    homeTreatment.set({
      state,
      cancelledBy: {
        role,
        user: xAuthUser,
        ...cancelReason,
      },
      updatedBy: xAuthUser,
    });
    return await homeTreatment.save();
  }
}
