import { Injectable } from "@nestjs/common";
import { IndepthService } from "./indepth.service";
import { IndepthHookService } from "./indepth-hook.service";
import { Indepth } from "../schemas/indepth.schema";
import { IndepthBaseErrMsg } from "../indepth.constant";
import { RejectIndepthDto } from "../dto/reject-indepth.dto";
import { CancelIndepthDto } from "../dto/cancel-indepth.dto";

@Injectable()
export class CancelIndepthService {
  constructor(
    private readonly service: IndepthService,
    private readonly hookService: IndepthHookService
  ) {}

  async reject(
    indepthId: string,
    rejectReason: RejectIndepthDto,
    xAuthUser: string
  ): Promise<Indepth> {
    const indepth = await this.service.getDocumentById(indepthId, {
      baseErrMsg: IndepthBaseErrMsg.REJECT,
    });

    const [state, role] = await Promise.all([
      this.hookService.validateStateFlow(indepth, "REJECTED", {
        baseErrMsg: IndepthBaseErrMsg.REJECT,
      }),
      this.hookService.validateIfxAuthUserIsProviderOrAdmin(
        indepth,
        xAuthUser,
        {
          baseErrMsg: IndepthBaseErrMsg.REJECT,
        }
      ),
    ]);

    indepth.set({
      state,
      cancelledBy: {
        role,
        user: xAuthUser,
        ...rejectReason,
      },
      updatedBy: xAuthUser,
    });
    return await indepth.save();
  }

  async cancel(
    indepthId: string,
    cancelReason: CancelIndepthDto,
    xAuthUser: string
  ): Promise<Indepth> {
    const indepth = await this.service.getDocumentById(indepthId, {
      baseErrMsg: IndepthBaseErrMsg.CANCEL,
    });

    const [state, role] = await Promise.all([
      this.hookService.validateStateFlow(indepth, "CANCELLED", {
        baseErrMsg: IndepthBaseErrMsg.CANCEL,
      }),
      this.hookService.validateIfxAuthUserIsPatientOrAdmin(indepth, xAuthUser, {
        baseErrMsg: IndepthBaseErrMsg.CANCEL,
      }),
    ]);

    indepth.set({
      state,
      cancelledBy: {
        role,
        user: xAuthUser,
        ...cancelReason,
      },
      updatedBy: xAuthUser,
    });
    return await indepth.save();
  }
}
