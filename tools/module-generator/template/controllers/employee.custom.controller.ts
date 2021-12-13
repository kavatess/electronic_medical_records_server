import {
    Controller,
    UseGuards,
} from "@nestjs/common";
import { EmployeeService } from "../employee.service";
import {
    ApiSecurity,
    ApiTags,
} from "@nestjs/swagger";
import { AuthenticatedHeaderGuard } from "src/auth/guards/authenticated-header.guard";
import { PoliciesGuard } from "src/auth/guards/policies.guard";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";

@ApiTags("employee-custom")
@UseGuards(AuthenticatedHeaderGuard, PoliciesGuard)
@ApiSecurity("ApiKeyAuth", ["token"])
@Controller("employee")
export class EmployeeCustomController {
    constructor(
        private readonly service: EmployeeService,
        private readonly rabbitBaseService: RabbitBaseService
    ) { }

}
