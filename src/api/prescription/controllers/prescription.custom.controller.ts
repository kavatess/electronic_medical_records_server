import { Body, Controller, Headers, Post, UseGuards } from "@nestjs/common";
import { PrescriptionService } from "../prescription.service";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { AuthenticatedHeaderGuard } from "src/auth/guards/authenticated-header.guard";
import { PoliciesGuard } from "src/auth/guards/policies.guard";
import { CheckPolicies } from "src/auth/casl/check-policy.decorator";
import { Action, AppAbility } from "src/auth/casl/app-ability";
import { Prescription } from "../schemas/prescription.schema";
import { ApiErrorResponses } from "src/decorators/api-error-responses.decorator";
import { CreatePrescriptionDto } from "../dto/create-prescription.dto";

@ApiTags("prescription-custom")
@UseGuards(AuthenticatedHeaderGuard, PoliciesGuard)
@ApiSecurity("ApiKeyAuth", ["token"])
@Controller("prescription")
export class PrescriptionCustomController {
  constructor(private readonly mainService: PrescriptionService) {}

  @Post("/create")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, Prescription)
  )
  @ApiBody({ type: CreatePrescriptionDto })
  @ApiCreatedResponse({ type: Prescription })
  @ApiErrorResponses(["400", "401", "403", "404", "405"])
  async create(
    @Body() prescription: CreatePrescriptionDto,
    @Headers("x-auth-user") xAuthUser: string
  ): Promise<Prescription> {
    return await this.mainService.createPrescription(prescription, xAuthUser);
  }
}
