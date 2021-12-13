import { Injectable } from "@nestjs/common";
import { IndepthHookService } from "./indepth-hook.service";
import { Indepth } from "../schemas/indepth.schema";
import { IndepthBaseErrMsg } from "../indepth.constant";
import { IndepthService } from "./indepth.service";

@Injectable()
export class CompleteIndepthService {
  constructor(
    private readonly service: IndepthService,
    private readonly hookService: IndepthHookService
  ) {}

  async complete(
    indepthId: string,
    completeState: string,
    xAuthUser: string
  ): Promise<Indepth> {
    const indepth = await this.service.getDocumentById(indepthId, {
      baseErrMsg: IndepthBaseErrMsg.COMPLETE,
    });

    await Promise.all([
      this.hookService.validateIfxAuthUserIsProviderOrAdmin(
        indepth,
        xAuthUser,
        {
          baseErrMsg: IndepthBaseErrMsg.COMPLETE,
        }
      ),
      this.hookService.validateStateFlow(indepth, completeState, {
        baseErrMsg: IndepthBaseErrMsg.COMPLETE,
      }),
    ]);

    indepth.set({
      state: completeState,
      updatedBy: xAuthUser,
    });
    return await indepth.save();
  }
}
