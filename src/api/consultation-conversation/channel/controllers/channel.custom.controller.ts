import { Controller, UseGuards } from "@nestjs/common";
import { ChannelService } from "../channel.service";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { AuthenticatedHeaderGuard } from "src/auth/guards/authenticated-header.guard";
import { PoliciesGuard } from "src/auth/guards/policies.guard";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";

@ApiTags("channel-custom")
@UseGuards(AuthenticatedHeaderGuard, PoliciesGuard)
@ApiSecurity("ApiKeyAuth", ["token"])
@Controller("channel")
export class ChannelCustomController {
  constructor(
    private readonly service: ChannelService,
    private readonly rabbitBaseService: RabbitBaseService
  ) {}
}
