import { Controller, UseGuards } from "@nestjs/common";
import { MedicalReferenceService } from "../medical-reference.service";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { AuthenticatedHeaderGuard } from "src/auth/guards/authenticated-header.guard";
import { PoliciesGuard } from "src/auth/guards/policies.guard";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";

@ApiTags("medical-reference-custom")
@UseGuards(AuthenticatedHeaderGuard, PoliciesGuard)
@ApiSecurity("ApiKeyAuth", ["token"])
@Controller("medical-reference")
export class MedicalReferenceCustomController {
  constructor(
    private readonly service: MedicalReferenceService,
    private readonly rabbitBaseService: RabbitBaseService
  ) {}
}
