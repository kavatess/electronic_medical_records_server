import {
  Body,
  Post,
  Controller,
  UseGuards,
  Headers,
  Put,
  Param,
} from "@nestjs/common";
import {
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { Types } from "mongoose";
import { Action, AppAbility } from "src/auth/casl/app-ability";
import { CheckPolicies } from "src/auth/casl/check-policy.decorator";
import { AuthenticatedHeaderGuard } from "src/auth/guards/authenticated-header.guard";
import { PoliciesGuard } from "src/auth/guards/policies.guard";
import { ApiErrorResponses } from "src/decorators/api-error-responses.decorator";
import { ParseMongoIdPipe } from "src/pipes/parse-mongo-id.pipe";
import { AnswerFormByPatientDto } from "./dto/answer-form-by-patient.dto";
import { CancelHomeTreatmentDto } from "./dto/cancel-home-treatment.dto";
import { CompleteHomeTreatmentDto } from "./dto/complete-home-treatment.dto";
import { CreateHomeTreatmentDto } from "./dto/create-home-treatment.dto";
import { RejectHomeTreatmentDto } from "./dto/reject-home-treatment.dto";
import { RequestFormByAdminDto } from "./dto/request-form-by-admin.dto";
import { UpdateHomeTreatmentByPatientDto } from "./dto/update-home-treatment-by-patient.dto";
import { UpdateHomeTreatmentByProviderDto } from "./dto/update-home-treatment-by-provider";
import { HomeTreatment } from "./schemas/home-treatment.schema";
import { CancelHomeTreatmentService } from "./services/cancel-home-treatment.service";
import { CompleteHomeTreatmentService } from "./services/complete-home-treatment.service";
import { CreateHomeTreatmentService } from "./services/create-home-treatment.service";
import { HomeTreatmentFormService } from "./services/home-treatment-form.service";
import { UpdateHomeTreatmentService } from "./services/update-home-treatment.service";

@ApiTags("consultation/home-treatment")
@UseGuards(AuthenticatedHeaderGuard, PoliciesGuard)
@ApiSecurity("ApiKeyAuth", ["token"])
@Controller("consultation/home-treatment")
export class HomeTreatmentController {
  constructor(
    private readonly createService: CreateHomeTreatmentService,
    private readonly updateService: UpdateHomeTreatmentService,
    private readonly formService: HomeTreatmentFormService,
    private readonly completeService: CompleteHomeTreatmentService,
    private readonly cancelService: CancelHomeTreatmentService
  ) {}

  @Post("/create")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, HomeTreatment)
  )
  @ApiBody({ type: CreateHomeTreatmentDto })
  @ApiOkResponse({ type: HomeTreatment })
  @ApiErrorResponses(["400", "401", "403", "404", "405"])
  async create(
    @Body() homeTreatment: CreateHomeTreatmentDto,
    @Headers("x-auth-user") xAuthUser: string
  ): Promise<HomeTreatment> {
    return await this.createService.create(homeTreatment, xAuthUser);
  }

  @Put("/:homeTreatmentId/patient-update")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, HomeTreatment)
  )
  @ApiParam({ name: "homeTreatmentId", type: Types.ObjectId, required: true })
  @ApiBody({ type: UpdateHomeTreatmentByPatientDto, required: true })
  @ApiOkResponse({ type: HomeTreatment })
  @ApiErrorResponses(["400", "401", "403", "404", "405"])
  async updateHomeTreatmentByPatient(
    @Param("homeTreatmentId", ParseMongoIdPipe) homeTreatmentId: string,
    @Body() illness: UpdateHomeTreatmentByPatientDto,
    @Headers("x-auth-user") xAuthUser: string
  ): Promise<HomeTreatment> {
    return await this.updateService.updateHomeTreatmentByPatient(
      homeTreatmentId,
      illness,
      xAuthUser
    );
  }

  @Post("/:homeTreatmentId/form/admin-request")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, HomeTreatment)
  )
  @ApiParam({ name: "homeTreatmentId", type: Types.ObjectId, required: true })
  @ApiBody({ type: RequestFormByAdminDto, required: true })
  @ApiOkResponse({ type: HomeTreatment })
  @ApiErrorResponses(["400", "401", "403", "404", "405"])
  async requestFormByAdmin(
    @Param("homeTreatmentId", ParseMongoIdPipe) homeTreatmentId: string,
    @Body() form: RequestFormByAdminDto,
    @Headers("x-auth-user") xAuthUser: string
  ): Promise<HomeTreatment> {
    return await this.formService.requestFormByAdmin(
      homeTreatmentId,
      form,
      xAuthUser
    );
  }

  @Post("/form/patient-fillout")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, HomeTreatment)
  )
  @ApiBody({ type: AnswerFormByPatientDto, required: true })
  @ApiOkResponse({ type: HomeTreatment })
  @ApiErrorResponses(["400", "401", "403", "404", "405"])
  async answerFormByPatient(
    @Body() form: AnswerFormByPatientDto,
    @Headers("x-auth-user") xAuthUser: string
  ): Promise<HomeTreatment> {
    return await this.formService.answerFormByPatient(form, xAuthUser);
  }

  @Put("/:homeTreatmentId/provider-update")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, HomeTreatment)
  )
  @ApiParam({ name: "homeTreatmentId", type: Types.ObjectId, required: true })
  @ApiBody({ type: UpdateHomeTreatmentByProviderDto, required: true })
  @ApiOkResponse({ type: HomeTreatment })
  @ApiErrorResponses(["400", "401", "403", "404", "405"])
  async updateHomeTreatmentByProvider(
    @Param("homeTreatmentId", ParseMongoIdPipe) homeTreatmentId: string,
    @Body() illness: UpdateHomeTreatmentByProviderDto,
    @Headers("x-auth-user") xAuthUser: string
  ): Promise<HomeTreatment> {
    return await this.updateService.updateHomeTreatmentByProvider(
      homeTreatmentId,
      illness,
      xAuthUser
    );
  }

  @Put("/:homeTreatmentId/complete")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, HomeTreatment)
  )
  @ApiParam({ name: "homeTreatmentId", type: Types.ObjectId, required: true })
  @ApiBody({ type: CompleteHomeTreatmentDto, required: true })
  @ApiOkResponse({ type: HomeTreatment })
  @ApiErrorResponses(["400", "401", "403", "404", "405"])
  async complete(
    @Param("homeTreatmentId", ParseMongoIdPipe) homeTreatmentId: string,
    @Body() body: CompleteHomeTreatmentDto,
    @Headers("x-auth-user") xAuthUser: string
  ): Promise<HomeTreatment> {
    return await this.completeService.complete(
      homeTreatmentId,
      body.state,
      xAuthUser
    );
  }

  @Put("/:homeTreatmentId/reject")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, HomeTreatment)
  )
  @ApiParam({ name: "homeTreatmentId", type: Types.ObjectId, required: true })
  @ApiBody({ type: RejectHomeTreatmentDto, required: true })
  @ApiOkResponse({ type: HomeTreatment })
  @ApiErrorResponses(["400", "401", "403", "404", "405"])
  async reject(
    @Param("homeTreatmentId", ParseMongoIdPipe) homeTreatmentId: string,
    @Body() rejectReason: RejectHomeTreatmentDto,
    @Headers("x-auth-user") xAuthUser: string
  ): Promise<HomeTreatment> {
    return await this.cancelService.reject(
      homeTreatmentId,
      rejectReason,
      xAuthUser
    );
  }

  @Put("/:homeTreatmentId/cancel")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, HomeTreatment)
  )
  @ApiParam({ name: "homeTreatmentId", type: Types.ObjectId, required: true })
  @ApiBody({ type: CancelHomeTreatmentDto, required: true })
  @ApiOkResponse({ type: HomeTreatment })
  @ApiErrorResponses(["400", "401", "403", "404", "405"])
  async cancel(
    @Param("homeTreatmentId", ParseMongoIdPipe) homeTreatmentId: string,
    @Body() cancelReason: CancelHomeTreatmentDto,
    @Headers("x-auth-user") xAuthUser: string
  ): Promise<HomeTreatment> {
    return await this.cancelService.cancel(
      homeTreatmentId,
      cancelReason,
      xAuthUser
    );
  }
}
