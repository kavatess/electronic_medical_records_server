import { Controller, UseGuards } from "@nestjs/common";
import { RelationshipService } from "../relationship.service";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { AuthenticatedHeaderGuard } from "src/auth/guards/authenticated-header.guard";
import { PoliciesGuard } from "src/auth/guards/policies.guard";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";

@ApiTags("relationship-custom")
@UseGuards(AuthenticatedHeaderGuard, PoliciesGuard)
@ApiSecurity("ApiKeyAuth", ["token"])
@Controller("relationship")
export class RelationshipCustomController {
  constructor(
    private readonly service: RelationshipService,
    private readonly rabbitBaseService: RabbitBaseService
  ) {}
}
