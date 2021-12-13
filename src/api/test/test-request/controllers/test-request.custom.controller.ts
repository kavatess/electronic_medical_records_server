import { Body, Controller, Headers, Post, UseGuards } from "@nestjs/common";
import { TestRequestService } from "../test-request.service";
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
import { TestRequest } from "../schemas/test-request.schema";
import { ApiErrorResponses } from "src/decorators/api-error-responses.decorator";
import { CreateTestRequestDto } from "../dto/create-test-request.dto";

@ApiTags("test-request-custom")
@UseGuards(AuthenticatedHeaderGuard, PoliciesGuard)
@ApiSecurity("ApiKeyAuth", ["token"])
@Controller("test-request")
export class TestRequestCustomController {
  constructor(private readonly service: TestRequestService) {}

  @Post("/create")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, TestRequest)
  )
  @ApiBody({ type: CreateTestRequestDto })
  @ApiCreatedResponse({ type: TestRequest })
  @ApiErrorResponses(["409", "406", "403"])
  async create(
    @Body() testRequest: CreateTestRequestDto,
    @Headers("x-auth-user") xAuthUser: string
  ): Promise<TestRequest> {
    return await this.service.createTestRequest(testRequest, xAuthUser);
  }
}
