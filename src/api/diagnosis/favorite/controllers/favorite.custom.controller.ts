import { Controller, UseGuards } from "@nestjs/common";
import { FavoriteService } from "../favorite.service";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { AuthenticatedHeaderGuard } from "src/auth/guards/authenticated-header.guard";
import { PoliciesGuard } from "src/auth/guards/policies.guard";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";

@ApiTags("favorite-custom")
@UseGuards(AuthenticatedHeaderGuard, PoliciesGuard)
@ApiSecurity("ApiKeyAuth", ["token"])
@Controller("favorite")
export class FavoriteCustomController {
  constructor(
    private readonly service: FavoriteService,
    private readonly rabbitBaseService: RabbitBaseService
  ) {}
}
