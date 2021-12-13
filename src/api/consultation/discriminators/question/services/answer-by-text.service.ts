import { Injectable, MethodNotAllowedException } from "@nestjs/common";
import { QuestionService } from "./question.service";
import { QuestionHookService } from "./question-hook.service";
import { Question } from "../schemas/question.schema";
import {
  ANSWER_BY_TEXT_STATE_ENUM,
  QuestionBaseErrMsg,
} from "../question.constant";

@Injectable()
export class AnswerByTextService {
  constructor(
    private readonly service: QuestionService,
    private readonly hookService: QuestionHookService
  ) {}

  async answerByText(
    questionId: string,
    note: string,
    xAuthUser: string
  ): Promise<Question> {
    const question = await this.service.getDocumentById(questionId, {
      baseErrMsg: QuestionBaseErrMsg.ANSWER_BY_TEXT,
    });

    await this.hookService.validateIfxAuthUserIsProviderOrAdmin(
      question,
      xAuthUser,
      {
        baseErrMsg: QuestionBaseErrMsg.ANSWER_BY_TEXT,
      }
    );

    if (!ANSWER_BY_TEXT_STATE_ENUM.includes(question.state)) {
      throw new MethodNotAllowedException(
        `${QuestionBaseErrMsg.ANSWER_BY_TEXT}: Cannot answer question(${questionId}) with state(${question.state})`
      );
    }

    question.set({
      note,
      state: "INCONSULTATION",
      updatedBy: xAuthUser,
    });
    return await question.save();
  }
}
