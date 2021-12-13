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
import { CreateIndepthService } from "./services/create-indepth.service";
import { UpdateIndepthService } from "./services/update-indepth.service";
import { IndepthFormService } from "./services/indepth-form.service";
import { CompleteIndepthService } from "./services/complete-indepth.service";
import { CancelIndepthService } from "./services/cancel-indepth.service";
import { IndepthFollowUpQuestionService } from "./services/indepth-follow-up-question.service";
import { Indepth } from "./schemas/indepth.schema";
import { CreateIndepthDto } from "./dto/create-indepth.dto";
import { ParseMongoIdPipe } from "src/pipes/parse-mongo-id.pipe";
import { Types } from "mongoose";
import { UpdateIndepthByPatientDto } from "./dto/update-indepth-by-patient.dto";
import { RequestFormByAdminDto } from "./dto/request-form-by-admin.dto";
import { AnswerFormByPatientDto } from "./dto/answer-form-by-patient.dto";
import { UpdateIndepthByProviderDto } from "./dto/update-indepth-by-provider";
import { RejectIndepthDto } from "./dto/reject-indepth.dto";
import { CompleteIndepthDto } from "./dto/complete-indepth.dto";
import { CancelIndepthDto } from "./dto/cancel-indepth.dto";
import { CreateFollowUpQuestionDto } from "./dto/create-follow-up-question.dto";
import { AnswerFollowUpQuestionDto } from "./dto/answer-follow-up-question.dto";
import { CancelFollowUpQuestionDto } from "./dto/cancel-follow-up-question.dto";

@ApiTags("consultation/indepth")
@UseGuards(AuthenticatedHeaderGuard, PoliciesGuard)
@ApiSecurity("ApiKeyAuth", ["token"])
@Controller("consultation/indepth")
export class IndepthController {
  constructor(
    private readonly createService: CreateIndepthService,
    private readonly updateService: UpdateIndepthService,
    private readonly formService: IndepthFormService,
    private readonly completeService: CompleteIndepthService,
    private readonly cancelService: CancelIndepthService,
    private readonly followUpQuestionService: IndepthFollowUpQuestionService
  ) {}

  @Post("/create")
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Indepth))
  @ApiBody({ type: CreateIndepthDto })
  @ApiOkResponse({ type: Indepth })
  @ApiErrorResponses(["400", "401", "403", "404", "405"])
  async create(
    @Body() indepth: CreateIndepthDto,
    @Headers("x-auth-user") xAuthUser: string
  ): Promise<Indepth> {
    return await this.createService.create(indepth, xAuthUser);
  }

  @Put("/:indepthId/patient-update")
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Indepth))
  @ApiParam({ name: "indepthId", type: Types.ObjectId, required: true })
  @ApiBody({ type: UpdateIndepthByPatientDto, required: true })
  @ApiOkResponse({ type: Indepth })
  @ApiErrorResponses(["400", "401", "403", "404", "405"])
  async updateIndepthByPatient(
    @Param("indepthId", ParseMongoIdPipe) indepthId: string,
    @Body() illness: UpdateIndepthByPatientDto,
    @Headers("x-auth-user") xAuthUser: string
  ): Promise<Indepth> {
    return await this.updateService.updateIndepthByPatient(
      indepthId,
      illness,
      xAuthUser
    );
  }

  @Post("/:indepthId/form/admin-request")
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Indepth))
  @ApiParam({ name: "indepthId", type: Types.ObjectId, required: true })
  @ApiBody({ type: RequestFormByAdminDto, required: true })
  @ApiOkResponse({ type: Indepth })
  @ApiErrorResponses(["400", "401", "403", "404", "405"])
  async requestFormByAdmin(
    @Param("indepthId", ParseMongoIdPipe) indepthId: string,
    @Body() form: RequestFormByAdminDto,
    @Headers("x-auth-user") xAuthUser: string
  ): Promise<Indepth> {
    return await this.formService.requestFormByAdmin(
      indepthId,
      form,
      xAuthUser
    );
  }

  @Post("/form/patient-fillout")
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Indepth))
  @ApiBody({ type: AnswerFormByPatientDto, required: true })
  @ApiOkResponse({ type: Indepth })
  @ApiErrorResponses(["400", "401", "403", "404", "405"])
  async answerFormByPatient(
    @Body() form: AnswerFormByPatientDto,
    @Headers("x-auth-user") xAuthUser: string
  ): Promise<Indepth> {
    return await this.formService.answerFormByPatient(form, xAuthUser);
  }

  @Put("/:indepthId/provider-update")
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Indepth))
  @ApiParam({ name: "indepthId", type: Types.ObjectId, required: true })
  @ApiBody({ type: UpdateIndepthByProviderDto, required: true })
  @ApiOkResponse({ type: Indepth })
  @ApiErrorResponses(["400", "401", "403", "404", "405"])
  async updateIndepthByProvider(
    @Param("indepthId", ParseMongoIdPipe) indepthId: string,
    @Body() illness: UpdateIndepthByProviderDto,
    @Headers("x-auth-user") xAuthUser: string
  ): Promise<Indepth> {
    return await this.updateService.updateIndepthByProvider(
      indepthId,
      illness,
      xAuthUser
    );
  }

  @Put("/:indepthId/complete")
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Indepth))
  @ApiParam({ name: "indepthId", type: Types.ObjectId, required: true })
  @ApiBody({ type: CompleteIndepthDto, required: true })
  @ApiOkResponse({ type: Indepth })
  @ApiErrorResponses(["400", "401", "403", "404", "405"])
  async complete(
    @Param("indepthId", ParseMongoIdPipe) indepthId: string,
    @Body() body: CompleteIndepthDto,
    @Headers("x-auth-user") xAuthUser: string
  ): Promise<Indepth> {
    return await this.completeService.complete(
      indepthId,
      body.state,
      xAuthUser
    );
  }

  @Put("/:indepthId/reject")
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Indepth))
  @ApiParam({ name: "indepthId", type: Types.ObjectId, required: true })
  @ApiBody({ type: RejectIndepthDto, required: true })
  @ApiOkResponse({ type: Indepth })
  @ApiErrorResponses(["400", "401", "403", "404", "405"])
  async reject(
    @Param("indepthId", ParseMongoIdPipe) indepthId: string,
    @Body() rejectReason: RejectIndepthDto,
    @Headers("x-auth-user") xAuthUser: string
  ): Promise<Indepth> {
    return await this.cancelService.reject(indepthId, rejectReason, xAuthUser);
  }

  @Put("/:indepthId/cancel")
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Indepth))
  @ApiParam({ name: "indepthId", type: Types.ObjectId, required: true })
  @ApiBody({ type: CancelIndepthDto, required: true })
  @ApiOkResponse({ type: Indepth })
  @ApiErrorResponses(["400", "401", "403", "404", "405"])
  async cancel(
    @Param("indepthId", ParseMongoIdPipe) indepthId: string,
    @Body() cancelReason: CancelIndepthDto,
    @Headers("x-auth-user") xAuthUser: string
  ): Promise<Indepth> {
    return await this.cancelService.cancel(indepthId, cancelReason, xAuthUser);
  }

  @Put("/:indepthId/follow-up-question/create")
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Indepth))
  @ApiParam({ name: "indepthId", type: Types.ObjectId, required: true })
  @ApiBody({ type: CreateFollowUpQuestionDto, required: true })
  @ApiOkResponse({ type: Indepth })
  @ApiErrorResponses(["400", "401", "403", "404", "405"])
  async createFollowUpQuestion(
    @Param("indepthId", ParseMongoIdPipe) indepthId: string,
    @Body() followUpQuestion: CreateFollowUpQuestionDto,
    @Headers("x-auth-user") xAuthUser: string
  ): Promise<Indepth> {
    return await this.followUpQuestionService.createFollowUpQuestion(
      indepthId,
      followUpQuestion,
      xAuthUser
    );
  }

  @Put("/:indepthId/follow-up-question/answer")
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Indepth))
  @ApiParam({ name: "indepthId", type: Types.ObjectId, required: true })
  @ApiBody({ type: AnswerFollowUpQuestionDto, required: true })
  @ApiOkResponse({ type: Indepth })
  @ApiErrorResponses(["400", "401", "403", "404", "405"])
  async answerFollowUpQuestion(
    @Param("indepthId", ParseMongoIdPipe) indepthId: string,
    @Body() body: AnswerFollowUpQuestionDto,
    @Headers("x-auth-user") xAuthUser: string
  ): Promise<Indepth> {
    return await this.followUpQuestionService.answerFollowUpQuestion(
      indepthId,
      body.answer,
      xAuthUser
    );
  }

  @Put("/:indepthId/follow-up-question/cancel")
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Indepth))
  @ApiParam({ name: "indepthId", type: Types.ObjectId, required: true })
  @ApiBody({ type: CancelFollowUpQuestionDto, required: true })
  @ApiOkResponse({ type: Indepth })
  @ApiErrorResponses(["400", "401", "403", "404", "405"])
  async cancelFollowUpQuestion(
    @Param("indepthId", ParseMongoIdPipe) indepthId: string,
    @Body() body: CancelFollowUpQuestionDto,
    @Headers("x-auth-user") xAuthUser: string
  ): Promise<Indepth> {
    return await this.followUpQuestionService.cancelFollowUpQuestion(
      indepthId,
      body.state,
      xAuthUser
    );
  }
}
