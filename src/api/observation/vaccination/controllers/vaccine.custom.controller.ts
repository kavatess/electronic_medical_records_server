import {
  CacheInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiAcceptedResponse,
  ApiOkResponse,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { ObservationService } from "src/api/observation/observation/observation.service";
import { Observation } from "src/api/observation/observation/schemas/observation.schema";
import { Action, AppAbility } from "src/auth/casl/app-ability";
import { CheckPolicies } from "src/auth/casl/check-policy.decorator";
import { ApiErrorResponses } from "src/decorators/api-error-responses.decorator";
import { ApiQueries } from "src/decorators/api-queries.decorator";
import vaccineSchedule from "../data/vaccination-schedule.json";
import _ from "lodash";

@ApiTags("vaccination")
@ApiSecurity("ApiKeyAuth", ["token"])
@Controller("")
export class VaccineCustomController {
  constructor(private readonly observationService: ObservationService) {}

  @Get("vaccine/patient/:user/schedule")
  @ApiOkResponse({})
  @ApiQueries(["locale"])
  @ApiErrorResponses(["403"])
  async getVaccineScheduleForPatient(
    @Param() param: Record<string, string>
  ): Promise<any[]> {
    return vaccineSchedule;
  }

  @Get("vaccine/schedule")
  @UseInterceptors(CacheInterceptor)
  @ApiOkResponse({})
  @ApiQueries(["locale"])
  @ApiErrorResponses(["403"])
  async getVaccineSchedule(
    @Param() param: Record<string, string>
  ): Promise<any[]> {
    return vaccineSchedule;
  }

  @Get("/consultation/preview-medical-health/vacxin/:user")
  @ApiParam({ name: "user", type: String, required: true })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Observation))
  @ApiErrorResponses(["403"])
  @ApiQueries(["locale"])
  @ApiAcceptedResponse()
  async getUserVaccination(
    @Query() query: Record<string, any>,
    @Param() params: Record<string, string>
  ): Promise<any> {
    const filter = {
      user: params.user,
      key: { $regex: "vacxin-" },
    };
    query.limit = 500;
    let item = await this.observationService.find(filter, query.fields, query);
    item = _.unionBy(item, (i) => i["key"]);
    const vaccineMap = item.map((i) => {
      const count = i["key"].split("-").length;
      const vaccineName = i["key"]
        .split("-")
        .splice(2, count - 3)
        .join("-");
      const vaccineDisease = i["key"].split("-")[1];
      return {
        disease: vaccineDisease,
        dose: `vacxin-${vaccineDisease}-${vaccineName}`,
        name: vaccineName,
        total: vaccineSchedule
          .filter((i) => i.disease == vaccineDisease)[0]
          .vaccines.filter((i) => i.name == vaccineName)[0].schedule.length,
        injected: i["key"].split("-").pop(),
      };
    });
    // let diseaseGroup = _.groupBy(vaccineMap, (i) => i.dose)
    const output = {
      vacxin: {},
    } as any;
    vaccineMap.forEach((i) => {
      if (!output.vacxin[i.disease]) output.vacxin[i.disease] = {};
      output.vacxin[i.disease][i.dose] = i;
    });
    return output;
  }

  // GET {{apisUrl}}/gateway/api/consultation/list-like-medical-health/vacxin-/611cb0d3addd5ff15d3c83a3?locale=vi&filter=%7B%22status%22%3A%7B%22%24ne%22%3A%22archived%22%7D%7D&pageSize=100&sort=-observedAt&pageIndex=0
  @Get("/consultation/list-like-medical-health/vacxin-/:user")
  @ApiParam({ name: "user", type: String, required: true })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Observation))
  @ApiErrorResponses(["403"])
  @ApiQueries(["locale"])
  @ApiAcceptedResponse()
  async getUserObsByKey(
    @Query() query: Record<string, any>,
    @Param() params: Record<string, string>
  ): Promise<any> {
    const filter = {
      user: params.user,
      key: { $regex: "vacxin-" },
    };
    query.limit = 500;
    let item = await this.observationService.find(filter, query.fields, query);
    item = _.unionBy(item, (i) => i["key"]);
    return _.groupBy(item, (i) => i.key);
  }
}
