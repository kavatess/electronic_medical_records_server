import { Controller, UseGuards } from "@nestjs/common";
import { TestResultService } from "../test-result.service";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { AuthenticatedHeaderGuard } from "src/auth/guards/authenticated-header.guard";
import { PoliciesGuard } from "src/auth/guards/policies.guard";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";

@ApiTags("test-result-custom")
@UseGuards(AuthenticatedHeaderGuard, PoliciesGuard)
@ApiSecurity("ApiKeyAuth", ["token"])
@Controller("test-result")
export class TestResultCustomController {
  constructor(
    private readonly service: TestResultService,
    private readonly rabbitBaseService: RabbitBaseService
  ) {}
}
