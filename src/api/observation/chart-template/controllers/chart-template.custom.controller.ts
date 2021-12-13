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
import { promises as fs } from "fs";
import path from "path";
import { ChartTemplateDto } from "../dto/chart-template.dto";

@ApiTags("chart-template")
@ApiSecurity("ApiKeyAuth", ["token"])
@Controller("")
export class ChartTemplateCustomController {
  // chart/template/cdc/length-for-age-girl-birthto240m-percentile-cdc [dep]
  @Get("chart/template/:source/:slug")
  @UseInterceptors(CacheInterceptor)
  @ApiOkResponse({ type: ChartTemplateDto })
  @ApiQueries(["locale"])
  @ApiErrorResponses(["403"])
  async getChartTemplateBySlug_old(
    @Param() param: Record<string, string>
  ): Promise<ChartTemplateDto[]> {
    const file = path.resolve(__dirname, `../data/${param.slug}.json`);
    if (!file) throw Error("404 not found");
    const fileBuffer = await fs.readFile(file);
    return JSON.parse(fileBuffer.toString());
  }

  @Get("chart-template/:slug")
  @UseInterceptors(CacheInterceptor)
  @ApiOkResponse({ type: ChartTemplateDto })
  @ApiQueries(["locale"])
  @ApiErrorResponses(["403"])
  async getChartTemplateBySlug(
    @Param() param: Record<string, string>
  ): Promise<ChartTemplateDto[]> {
    const file = path.resolve(__dirname, `../data/${param.slug}.json`);
    if (!file) throw Error("404 not found");
    const fileBuffer = await fs.readFile(file);
    return JSON.parse(fileBuffer.toString());
  }
}
