import { Controller, UseGuards } from "@nestjs/common";
import { DiagnosisSuggestionService } from "../diagnosis-suggestion.service";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { AuthenticatedHeaderGuard } from "src/auth/guards/authenticated-header.guard";
import { PoliciesGuard } from "src/auth/guards/policies.guard";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";

@ApiTags("diagnosis-suggestion-custom")
@UseGuards(AuthenticatedHeaderGuard, PoliciesGuard)
@ApiSecurity("ApiKeyAuth", ["token"])
@Controller("diagnosis-suggestion")
export class DiagnosisSuggestionCustomController {
  constructor(
    private readonly service: DiagnosisSuggestionService,
    private readonly rabbitBaseService: RabbitBaseService
  ) {}
}
