import { Injectable } from "@nestjs/common";
import { RejectQuestionDto } from "../dto/reject-question.dto";
import { QuestionHookService } from "./question-hook.service";
import { Question } from "../schemas/question.schema";
import { QuestionBaseErrMsg } from "../question.constant";
import { QuestionService } from "./question.service";

@Injectable()
export class CancelQuestionService {
  constructor(
    private readonly service: QuestionService,
    private readonly hookService: QuestionHookService
  ) {}

  async reject(
    questionId: string,
    rejectReason: RejectQuestionDto,
    xAuthUser: string
  ): Promise<Question> {
    const question = await this.service.getDocumentById(questionId, {
      baseErrMsg: QuestionBaseErrMsg.REJECT,
    });

    const [state, role] = await Promise.all([
      this.hookService.validateStateFlow(question, "REJECTED", {
        baseErrMsg: QuestionBaseErrMsg.REJECT,
      }),
      this.hookService.validateIfxAuthUserIsProviderOrAdmin(
        question,
        xAuthUser,
        {
          baseErrMsg: QuestionBaseErrMsg.REJECT,
        }
      ),
    ]);

    question.set({
      state,
      cancelledBy: {
        role,
        user: xAuthUser,
        ...rejectReason,
      },
      updatedBy: xAuthUser,
    });
    return await question.save();
  }

  async cancel(
    questionId: string,
    rejectReason: RejectQuestionDto,
    xAuthUser: string
  ): Promise<Question> {
    const question = await this.service.getDocumentById(questionId, {
      baseErrMsg: QuestionBaseErrMsg.REJECT,
    });

    const [state, role] = await Promise.all([
      this.hookService.validateStateFlow(question, "CANCELLED", {
        baseErrMsg: QuestionBaseErrMsg.REJECT,
      }),
      this.hookService.validateIfxAuthUserIsPatientOrAdmin(
        question,
        xAuthUser,
        {
          baseErrMsg: QuestionBaseErrMsg.REJECT,
        }
      ),
    ]);

    question.set({
      state,
      cancelledBy: {
        role,
        user: xAuthUser,
        ...rejectReason,
      },
      updatedBy: xAuthUser,
    });
    return await question.save();
  }
}
