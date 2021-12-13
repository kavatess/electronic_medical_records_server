import { Controller, UseGuards } from "@nestjs/common";
import { DiagnosisService } from "../diagnosis.service";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { AuthenticatedHeaderGuard } from "src/auth/guards/authenticated-header.guard";
import { PoliciesGuard } from "src/auth/guards/policies.guard";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";

@ApiTags("diagnosis-custom")
@UseGuards(AuthenticatedHeaderGuard, PoliciesGuard)
@ApiSecurity("ApiKeyAuth", ["token"])
@Controller("diagnosis")
export class DiagnosisCustomController {
  constructor(
    private readonly service: DiagnosisService,
    private readonly rabbitBaseService: RabbitBaseService
  ) {}
}
