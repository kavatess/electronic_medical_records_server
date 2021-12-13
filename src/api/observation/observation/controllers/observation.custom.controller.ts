import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ObservationService } from "../observation.service";
import {
  ApiAcceptedResponse,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { AuthenticatedHeaderGuard } from "src/auth/guards/authenticated-header.guard";
import { PoliciesGuard } from "src/auth/guards/policies.guard";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";
import { CheckPolicies } from "src/auth/casl/check-policy.decorator";
import { Action, AppAbility } from "src/auth/casl/app-ability";
import { ApiErrorResponses } from "src/decorators/api-error-responses.decorator";
import { ApiQueries } from "src/decorators/api-queries.decorator";
import { Observation } from "../schemas/observation.schema";
import { ConfigService } from "@nestjs/config";
import { lastValueFrom } from "rxjs";

@ApiTags("observation-custom")
@UseGuards(AuthenticatedHeaderGuard, PoliciesGuard)
@ApiSecurity("ApiKeyAuth", ["token"])
@Controller("")
export class ObservationCustomController {
  constructor(
    private readonly service: ObservationService,
    private readonly configService: ConfigService,
    private readonly rabbitBaseService: RabbitBaseService,
    private readonly httpService: HttpService
  ) {}

  @Post("/consultation/create-medical-health/:user")
  @ApiParam({ name: "user", type: String, required: true })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Manage, Observation)
  )
  @ApiErrorResponses(["403"])
  @ApiQueries(["locale"])
  @ApiAcceptedResponse()
  async createMedicalHealth(
    @Body() body: Record<string, any>,
    @Query() query: Record<string, any>,
    @Param() params: Record<string, string>
  ): Promise<any> {
    const app = this.configService.get("app");
    const data = Object.keys(body).map((i) => body[i])[0];
    data["user"] = params.user;
    const url = `http://localhost:${app.port}/${app.base}/observation`.replace(/\/\/\//g,"/")
    return lastValueFrom(this.httpService.post(url,data))
      .then((res) => res.data.results)
      .catch((err) => {
        console.error(err)
        throw Error(err.response.data.message);
      });
  }

  // GET consultation/list-like-medical-health/height/613de7f579428dc753c280e0
  @Get("/consultation/list-like-medical-health/:key/:user")
  @ApiParam({ name: "user", type: String, required: true })
  @ApiParam({ name: "key", type: String, required: true })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Manage, Observation)
  )
  @ApiErrorResponses(["403"])
  @ApiQueries(["locale"])
  @ApiAcceptedResponse()
  async getListLike(@Param() params: Record<string, string>): Promise<any> {
    const allObs = await this.service.find({
      key: { $regex: params.key },
      user: params.user,
    });
    const output = {} as any;
    allObs.forEach((obs) => {
      if (!output[obs.key]) output[obs.key] = [];
      else output[obs.key].push(obs);
    });
    return output;
  }

  // POST {{apisUrl}}/gateway/api/consultation/edit-medical-health/6195dd746fcb532605e57621/613de7f579428dc753c280e0
  /*
  {
    "weight": {
        "id": "6195dd746fcb532605e57621",
        "name": "Person Weight",
        "unit": "Kg",
        "status": "published",
        "key": "weight",
        "value": 12.5,
        "observedAt": 1637168400000,
        "references": [],
        "temp": 12.5
    }
}
  */
  @Post("/consultation/edit-medical-health/:_id/:user")
  @ApiParam({ name: "user", type: String, required: true })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Manage, Observation)
  )
  @ApiErrorResponses(["403"])
  @ApiQueries(["locale"])
  @ApiAcceptedResponse()
  async editMedicalHealth(
    @Body() body: Record<string, any>,
    @Param() params: Record<string, string>
  ): Promise<any> {
    const app = this.configService.get("app");
    const data = Object.keys(body).map((i) => body[i])[0];
    data["user"] = params.user;
    const url = `http://localhost:${app.port}/${app.base}/observation/${params._id}`.replace(/\/\/\//g,"/")
    return lastValueFrom(this.httpService.put(url,data))
      .then((res) => res.data.results)
      .catch((err) => {
        throw Error(err.response.data.message);
      });
  }

  // GET consultation/preview-medical-health/weight,height,headCircumference,spO2,systolic,diastolic,temperature/611cb0d3addd5ff15d3c83a3
  @Get("/consultation/preview-medical-health/:listObs/:user")
  @ApiParam({ name: "user", type: String, required: true })
  @ApiParam({ name: "key", type: String, required: true })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Manage, Observation)
  )
  @ApiErrorResponses(["403"])
  @ApiQueries(["locale"])
  @ApiAcceptedResponse()
  async getListOfObs(@Param() params: Record<string, string>): Promise<any> {
    // TODO: replace with aggregate, or mark isLatest record to improve performance
    const filter = {
      key: { $in: params.listObs.split(',') } as any,
      user: params.user,
    }
    const allObs = await this.service.find(filter,"key value user _id unit observedAt", {sort: '-observedAt'});
    const output = {} as any;
    allObs.forEach((obs) => {
      if(!output[obs.key]) output[obs.key] = obs;
    });
    return output;
  }
}
