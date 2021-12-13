import { Injectable } from "@nestjs/common";
import { QuestionHookService } from "./question-hook.service";
import { Question } from "../schemas/question.schema";
import { QuestionBaseErrMsg } from "../question.constant";
import { QuestionService } from "./question.service";

@Injectable()
export class CompleteQuestionService {
  constructor(
    private readonly service: QuestionService,
    private readonly hookService: QuestionHookService
  ) {}

  async complete(
    questionId: string,
    completeState: string,
    xAuthUser: string
  ): Promise<Question> {
    const question = await this.service.getDocumentById(questionId, {
      baseErrMsg: QuestionBaseErrMsg.COMPLETE,
    });

    await Promise.all([
      this.hookService.validateStateFlow(question, completeState, {
        baseErrMsg: QuestionBaseErrMsg.COMPLETE,
      }),
      this.hookService.validateIfxAuthUserIsProviderOrAdmin(
        question,
        xAuthUser,
        {
          baseErrMsg: QuestionBaseErrMsg.COMPLETE,
        }
      ),
    ]);

    question.set({
      state: completeState,
      updatedBy: xAuthUser,
    });
    return await question.save();
  }
}
