import { Injectable } from "@nestjs/common";
import { HomeTreatmentHookService } from "./home-treatment-hook.service";
import { HomeTreatment } from "../schemas/home-treatment.schema";
import { HomeTreatmentBaseErrMsg } from "../home-treatment.constant";
import { HomeTreatmentService } from "./home-treatment.service";

@Injectable()
export class CompleteHomeTreatmentService {
  constructor(
    private readonly service: HomeTreatmentService,
    private readonly hookService: HomeTreatmentHookService
  ) {}

  async complete(
    homeTreatmentId: string,
    completeState: string,
    xAuthUser: string
  ): Promise<HomeTreatment> {
    const homeTreatment = await this.service.getDocumentById(homeTreatmentId, {
      baseErrMsg: HomeTreatmentBaseErrMsg.COMPLETE,
    });

    await Promise.all([
      this.hookService.validateIfxAuthUserIsProviderOrAdmin(
        homeTreatment,
        xAuthUser,
        {
          baseErrMsg: HomeTreatmentBaseErrMsg.COMPLETE,
        }
      ),
      this.hookService.validateStateFlow(homeTreatment, completeState, {
        baseErrMsg: HomeTreatmentBaseErrMsg.COMPLETE,
      }),
    ]);

    homeTreatment.set({
      state: completeState,
      updatedBy: xAuthUser,
    });
    return await homeTreatment.save();
  }
}
