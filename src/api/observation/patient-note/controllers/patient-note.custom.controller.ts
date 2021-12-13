import { Controller, UseGuards } from "@nestjs/common";
import { PatientNoteService } from "../patient-note.service";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { AuthenticatedHeaderGuard } from "src/auth/guards/authenticated-header.guard";
import { PoliciesGuard } from "src/auth/guards/policies.guard";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";

@ApiTags("patientnote-custom")
@UseGuards(AuthenticatedHeaderGuard, PoliciesGuard)
@ApiSecurity("ApiKeyAuth", ["token"])
@Controller("patientnote")
export class PatientNoteCustomController {
  constructor(
    private readonly service: PatientNoteService,
    private readonly rabbitBaseService: RabbitBaseService
  ) {}
}
