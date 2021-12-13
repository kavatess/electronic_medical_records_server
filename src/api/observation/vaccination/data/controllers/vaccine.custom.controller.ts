import {
  CacheInterceptor,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from "@nestjs/common";
import { ApiOkResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ApiErrorResponses } from "src/decorators/api-error-responses.decorator";
import { ApiQueries } from "src/decorators/api-queries.decorator";
import vaccineSchedule from "../vaccination-schedule.json";

@ApiTags("vaccination")
@ApiSecurity("ApiKeyAuth", ["token"])
@Controller("vaccine")
export class VaccineCustomController {
  @Get("/patient/:user/schedule")
  @ApiOkResponse({})
  @ApiQueries(["locale"])
  @ApiErrorResponses(["403"])
  async getVaccineScheduleForPatient(
    @Param() param: Record<string, string>
  ): Promise<any[]> {
    return vaccineSchedule;
  }

  @Get("/schedule")
  @UseInterceptors(CacheInterceptor)
  @ApiOkResponse({})
  @ApiQueries(["locale"])
  @ApiErrorResponses(["403"])
  async getVaccineSchedule(
    @Param() param: Record<string, string>
  ): Promise<any[]> {
    return vaccineSchedule;
  }
}
