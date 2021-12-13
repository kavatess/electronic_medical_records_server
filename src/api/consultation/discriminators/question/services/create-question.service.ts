import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateConsultationService } from "src/api/consultation/models/create-consultation.service.model";
import { QuestionHookService } from "./question-hook.service";
import { Question } from "../schemas/question.schema";
import { CreateQuestionDto } from "../dto/create-question.dto";
import { QuestionBaseErrMsg } from "../question.constant";

@Injectable()
export class CreateQuestionService implements CreateConsultationService {
  constructor(
    @InjectModel("question")
    private readonly questionModel: Model<Question>,
    private readonly hookService: QuestionHookService
  ) {}

  async create(
    question: CreateQuestionDto,
    xAuthUser?: string
  ): Promise<Question> {
    await Promise.all([
      this.hookService.validateExistedProvider(question, {
        baseErrMsg: QuestionBaseErrMsg.CREATE,
      }),
      this.hookService.validateUserPatientRelationship(question, {
        baseErrMsg: QuestionBaseErrMsg.CREATE,
      }),
    ]);

    const newQuestion = new this.questionModel();
    newQuestion.set({
      ...question,
      createdBy: xAuthUser,
      updatedBy: xAuthUser,
    });

    await Promise.all([
      this.hookService.createShortlink(newQuestion),
      this.hookService.createConversation(newQuestion),
      this.hookService.createProviderPatientRelationship(newQuestion),
    ]);

    return await newQuestion.save();
  }
}
