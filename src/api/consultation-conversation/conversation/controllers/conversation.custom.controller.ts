import { Controller, UseGuards } from "@nestjs/common";
import { ConversationService } from "../conversation.service";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { AuthenticatedHeaderGuard } from "src/auth/guards/authenticated-header.guard";
import { PoliciesGuard } from "src/auth/guards/policies.guard";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";

@ApiTags("conversation-custom")
@UseGuards(AuthenticatedHeaderGuard, PoliciesGuard)
@ApiSecurity("ApiKeyAuth", ["token"])
@Controller("conversation")
export class ConversationCustomController {
  constructor(
    private readonly service: ConversationService,
    private readonly rabbitBaseService: RabbitBaseService
  ) {}
}
