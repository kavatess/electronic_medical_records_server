import { Controller, UseGuards } from "@nestjs/common";
import { PrescriptionAutoFillService } from "../prescription-auto-fill.service";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { AuthenticatedHeaderGuard } from "src/auth/guards/authenticated-header.guard";
import { PoliciesGuard } from "src/auth/guards/policies.guard";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";

@ApiTags("prescription-auto-fill-custom")
@UseGuards(AuthenticatedHeaderGuard, PoliciesGuard)
@ApiSecurity("ApiKeyAuth", ["token"])
@Controller("prescription-auto-fill")
export class PrescriptionAutoFillCustomController {
  constructor(
    private readonly service: PrescriptionAutoFillService,
    private readonly rabbitBaseService: RabbitBaseService
  ) {}
}
