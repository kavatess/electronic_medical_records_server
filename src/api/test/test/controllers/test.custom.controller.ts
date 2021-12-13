import { Controller, UseGuards } from "@nestjs/common";
import { TestService } from "../test.service";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { AuthenticatedHeaderGuard } from "src/auth/guards/authenticated-header.guard";
import { PoliciesGuard } from "src/auth/guards/policies.guard";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";

@ApiTags("test-custom")
@UseGuards(AuthenticatedHeaderGuard, PoliciesGuard)
@ApiSecurity("ApiKeyAuth", ["token"])
@Controller("test")
export class TestCustomController {
  constructor(
    private readonly service: TestService,
    private readonly rabbitBaseService: RabbitBaseService
  ) {}
}
