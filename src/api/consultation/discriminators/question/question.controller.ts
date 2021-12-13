import {
  Body,
  Controller,
  Headers,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { Action, AppAbility } from "src/auth/casl/app-ability";
import { CheckPolicies } from "src/auth/casl/check-policy.decorator";
import { AuthenticatedHeaderGuard } from "src/auth/guards/authenticated-header.guard";
import { PoliciesGuard } from "src/auth/guards/policies.guard";
import { ApiErrorResponses } from "src/decorators/api-error-responses.decorator";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { Question } from "./schemas/question.schema";
import { AnswerQuestionByTextDto } from "./dto/answer-question-by-text.dto";
import { CompleteQuestionDto } from "./dto/complete-question.dto";
import { RejectQuestionDto } from "./dto/reject-question.dto";
import { Types } from "mongoose";
import { ParseMongoIdPipe } from "src/pipes/parse-mongo-id.pipe";
import { CreateQuestionService } from "./services/create-question.service";
import { AnswerByTextService } from "./services/answer-by-text.service";
import { CompleteQuestionService } from "./services/complete-question.service";
import { CancelQuestionService } from "./services/cancel-question.service";

@ApiTags("consultation/question")
@UseGuards(AuthenticatedHeaderGuard, PoliciesGuard)
@ApiSecurity("ApiKeyAuth", ["token"])
@Controller("consultation/question")
export class QuestionController {
  constructor(
    private readonly createService: CreateQuestionService,
    private readonly answerByTextService: AnswerByTextService,
    private readonly completeService: CompleteQuestionService,
    private readonly cancelService: CancelQuestionService
  ) {}

  @Post("/create")
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Question))
  @ApiBody({ type: CreateQuestionDto })
  @ApiOkResponse({ type: Question })
  @ApiErrorResponses(["400", "401", "404", "405"])
  async create(
    @Body() question: CreateQuestionDto,
    @Headers("x-auth-user") xAuthUser: string
  ): Promise<Question> {
    return await this.createService.create(question, xAuthUser);
  }

  @Put("/:questionId/answer-by-text")
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Question))
  @ApiParam({ name: "questionId", type: Types.ObjectId, required: true })
  @ApiBody({ type: AnswerQuestionByTextDto, required: true })
  @ApiOkResponse({ type: Question })
  @ApiErrorResponses(["400", "401", "403", "404", "405"])
  async answerByText(
    @Param("questionId", ParseMongoIdPipe) questionId: string,
    @Body() answer: AnswerQuestionByTextDto,
    @Headers("x-auth-user") xAuthUser: string
  ): Promise<Question> {
    return await this.answerByTextService.answerByText(
      questionId,
      answer.note,
      xAuthUser
    );
  }

  @Put("/:questionId/complete")
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Question))
  @ApiParam({ name: "questionId", type: Types.ObjectId, required: true })
  @ApiBody({ type: CompleteQuestionDto, required: true })
  @ApiOkResponse({ type: Question })
  @ApiErrorResponses(["400", "401", "403", "404", "405"])
  async complete(
    @Param("questionId", ParseMongoIdPipe) questionId: string,
    @Body() body: CompleteQuestionDto,
    @Headers("x-auth-user") xAuthUser: string
  ): Promise<Question> {
    return await this.completeService.complete(
      questionId,
      body.state,
      xAuthUser
    );
  }

  @Put("/:questionId/reject")
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Question))
  @ApiParam({ name: "questionId", type: Types.ObjectId, required: true })
  @ApiBody({ type: RejectQuestionDto, required: true })
  @ApiOkResponse({ type: Question })
  @ApiErrorResponses(["400", "401", "403", "404", "405"])
  async reject(
    @Param("questionId", ParseMongoIdPipe) questionId: string,
    @Body() rejectReason: RejectQuestionDto,
    @Headers("x-auth-user") xAuthUser: string
  ): Promise<Question> {
    return await this.cancelService.reject(questionId, rejectReason, xAuthUser);
  }

  @Put("/:questionId/cancel")
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Question))
  @ApiParam({ name: "questionId", type: Types.ObjectId, required: true })
  @ApiBody({ type: RejectQuestionDto, required: true })
  @ApiOkResponse({ type: Question })
  @ApiErrorResponses(["400", "401", "403", "404", "405"])
  async cancel(
    @Param("questionId", ParseMongoIdPipe) questionId: string,
    @Body() rejectReason: RejectQuestionDto,
    @Headers("x-auth-user") xAuthUser: string
  ): Promise<Question> {
    return await this.cancelService.cancel(questionId, rejectReason, xAuthUser);
  }
}
