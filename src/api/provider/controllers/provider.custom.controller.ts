import { Controller, UseGuards } from "@nestjs/common";
import { ProviderService } from "../provider.service";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { AuthenticatedHeaderGuard } from "src/auth/guards/authenticated-header.guard";
import { PoliciesGuard } from "src/auth/guards/policies.guard";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";

@ApiTags("provider-custom")
@UseGuards(AuthenticatedHeaderGuard, PoliciesGuard)
@ApiSecurity("ApiKeyAuth", ["token"])
@Controller("provider")
export class ProviderCustomController {
  constructor(
    private readonly service: ProviderService,
    private readonly rabbitBaseService: RabbitBaseService
  ) {}
}
