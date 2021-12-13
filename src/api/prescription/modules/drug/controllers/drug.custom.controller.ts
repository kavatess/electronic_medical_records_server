import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from "@nestjs/common";
import { DrugService, SearchDrugResult } from "../drug.service";
import { ApiOkResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { AuthenticatedHeaderGuard } from "src/auth/guards/authenticated-header.guard";
import { PoliciesGuard } from "src/auth/guards/policies.guard";
import { CheckPolicies } from "src/auth/casl/check-policy.decorator";
import { Action, AppAbility } from "src/auth/casl/app-ability";
import { Drug } from "../schemas/drug.schema";
import { ApiQueries } from "src/decorators/api-queries.decorator";
import { ApiErrorResponses } from "src/decorators/api-error-responses.decorator";

@ApiTags("drug-custom")
@UseGuards(AuthenticatedHeaderGuard, PoliciesGuard)
@ApiSecurity("ApiKeyAuth", ["token"])
@Controller("drug")
export class DrugCustomController {
  constructor(private readonly service: DrugService) {}

  @Get("/custom/search")
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Drug))
  @ApiOkResponse({ type: SearchDrugResult })
  @ApiQueries(["slug", "filter", "skip", "limit", "sort", "fields"])
  @ApiErrorResponses(["400", "404"])
  async searchDrugs(
    @Query("slug", new DefaultValuePipe("")) slug: string,
    @Query("filter", new DefaultValuePipe(null)) filter: Record<string, any>,
    @Query("skip", new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query("limit", new DefaultValuePipe(0), ParseIntPipe) limit: number,
    @Query("sort", new DefaultValuePipe("name")) sort: string,
    @Query("fields", new DefaultValuePipe(null)) fields: string
  ): Promise<SearchDrugResult> {
    return await this.service.searchDrugs(slug, filter, {
      skip,
      limit,
      fields,
      sort,
    });
  }
}
