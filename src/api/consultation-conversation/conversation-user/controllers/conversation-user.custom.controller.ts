import { Controller, UseGuards } from "@nestjs/common";
import { ConversationUserService } from "../conversation-user.service";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { AuthenticatedHeaderGuard } from "src/auth/guards/authenticated-header.guard";
import { PoliciesGuard } from "src/auth/guards/policies.guard";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";

@ApiTags("conversation-user-custom")
@UseGuards(AuthenticatedHeaderGuard, PoliciesGuard)
@ApiSecurity("ApiKeyAuth", ["token"])
@Controller("conversation-user")
export class ConversationUserCustomController {
  constructor(
    private readonly service: ConversationUserService,
    private readonly rabbitBaseService: RabbitBaseService
  ) {}
}
