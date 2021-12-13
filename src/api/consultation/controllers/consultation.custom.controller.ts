import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiOkResponse, ApiParam, ApiSecurity, ApiTags } from "@nestjs/swagger";
import moment from "moment";
import { Types } from "mongoose";
import { AuthenticatedHeaderGuard } from "src/auth/guards/authenticated-header.guard";
import { PoliciesGuard } from "src/auth/guards/policies.guard";
import { CheckPolicies } from "src/auth/casl/check-policy.decorator";
import { Action, AppAbility } from "src/auth/casl/app-ability";
import { Consultation } from "../schemas/consultation.schema";
import { ApiErrorResponses } from "src/decorators/api-error-responses.decorator";
import { GetDetailForOnemrService } from "../services/get-detail-for-onemr.service";
import { GetDetailForOnemrApiResponse } from "../models/get-detail-for-onemr-api.response.model";
import { AuditService } from "../services/audit.service";
import { ParseMongoIdPipe } from "src/pipes/parse-mongo-id.pipe";
import { AuditMessage } from "../models/audit-message.model";
import {
  GET_ALL_API_DEFAULT_FIELDS,
  GET_ALL_QUESTION_API_DEFAULT_FIELDS,
  STATE_ENUM,
  TYPE_ENUM,
} from "../consultation.constant";
import { ParseTimestampPipe } from "src/pipes/parse-timestamp.pipe";
import { GetAllService } from "../services/get-all.service";
import { ApiQueries } from "src/decorators/api-queries.decorator";
import { GetAllApiResponse } from "../models/get-all-api.response.model";
import { GetDetailForDuduService } from "../services/get-detail-for-dudu.service";
import { GetDetailForDuduApiResponse } from "../models/get-detail-for-dudu-api.response.model";
import { promises as fs } from "fs";
import path from "path";
import { GetAllQuestionService } from "../services/get-all-question.service";
import { ParseListPipe } from "src/pipes/parse-list.pipe";
import { ParseJSONPipe } from "src/pipes/parse-json.pipe";

@ApiTags("consultation")
@UseGuards(AuthenticatedHeaderGuard, PoliciesGuard)
@ApiSecurity("ApiKeyAuth", ["token"])
@Controller("consultation")
export class ConsultationCustomController {
  constructor(
    private readonly auditService: AuditService,
    private readonly getAllService: GetAllService,
    private readonly getAllQuestionService: GetAllQuestionService,
    private readonly getDetailForOnemrService: GetDetailForOnemrService,
    private readonly getDetailForDuduService: GetDetailForDuduService
  ) {}

  @Get("/:consultId/detail")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, Consultation)
  )
  @ApiParam({ type: Types.ObjectId, name: "consultId", required: true })
  @ApiOkResponse({ type: GetDetailForOnemrApiResponse })
  @ApiErrorResponses(["400", "401", "403"])
  async getConsultDetail(
    @Param("consultId") consultId: string
  ): Promise<GetDetailForOnemrApiResponse> {
    return await this.getDetailForOnemrService.getConsultDetailForOnemr(
      consultId
    );
  }

  @Get("/details/:consultId")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, Consultation)
  )
  @ApiParam({ type: Types.ObjectId, name: "consultId", required: true })
  @ApiOkResponse({ type: GetDetailForDuduApiResponse })
  @ApiErrorResponses(["400", "401", "403"])
  async getConsultDetailForDudu(
    @Param("consultId") consultId: string
  ): Promise<GetDetailForDuduApiResponse> {
    return await this.getDetailForDuduService.getConsultDetailForDudu(
      consultId
    );
  }

  @Post("/:consultId/audit")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, Consultation)
  )
  @ApiParam({ type: Types.ObjectId, name: "consultId", required: true })
  @ApiOkResponse({ type: AuditMessage, isArray: true })
  @ApiErrorResponses(["400", "401", "403"])
  async audit(
    @Param("consultId", ParseMongoIdPipe) consultId: string
  ): Promise<AuditMessage[]> {
    return await this.auditService.auditConsultation(consultId);
  }

  @Get("/get-all")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, Consultation)
  )
  @ApiQueries(["fields", "limit", "skip", "state", "from", "to", "type"])
  @ApiOkResponse({ type: GetAllApiResponse, isArray: true })
  @ApiErrorResponses(["400", "401", "403"])
  async getAllConsultation(
    @Query("fields", new DefaultValuePipe([]), ParseListPipe)
    fields: string[],
    @Query("state", new DefaultValuePipe(STATE_ENUM), ParseListPipe)
    states: string[],
    @Query("limit", new DefaultValuePipe(0), ParseIntPipe)
    limit: number,
    @Query("skip", new DefaultValuePipe(0), ParseIntPipe)
    skip: number,
    @Query(
      "from",
      new DefaultValuePipe(moment().startOf("day").toISOString()),
      ParseTimestampPipe
    )
    from: string,
    @Query("to", new DefaultValuePipe(null))
    to: string,
    @Query("type", new DefaultValuePipe(TYPE_ENUM), ParseJSONPipe)
    type: Record<string, any>,
    @Query("rating", new DefaultValuePipe(null), ParseIntPipe) rating: number
  ): Promise<GetAllApiResponse> {
    fields = fields.concat(GET_ALL_API_DEFAULT_FIELDS);
    from = moment(from).startOf("day").toISOString();
    to = to
      ? moment(to).toISOString()
      : moment(from).endOf("day").toISOString();
    return await this.getAllService.getAllConsultation({
      from,
      to,
      states,
      type,
      fields,
      limit,
      skip,
      rating,
    });
  }

  @Get("/get-all/question")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, Consultation)
  )
  @ApiQueries(["fields", "state", "from", "to", "type"])
  @ApiOkResponse({ type: GetAllApiResponse, isArray: true })
  @ApiErrorResponses(["400", "401", "403"])
  async getAllQuestion(
    @Query("fields", new DefaultValuePipe([]), ParseListPipe)
    fields: string[],
    @Query("state", new DefaultValuePipe(["WAITING"]), ParseListPipe)
    states: string[]
  ): Promise<any> {
    fields = fields.concat(GET_ALL_QUESTION_API_DEFAULT_FIELDS);
    states = states.map((state) => state.toUpperCase());
    return await this.getAllQuestionService.getAllQuestion(fields, states);
  }

  @Get("/:type/rejection-template")
  @ApiQueries(["for", "locale"])
  @ApiOkResponse({})
  @ApiErrorResponses(["400", "401", "403", "426"])
  async getRejectionTemplate(
    @Param() param: Record<string, string>,
    @Query() query: Record<string, string>
  ): Promise<[]> {
    if (!query.for) throw Error("426 missing for query");
    if (!query.locale) query.locale = "vi";
    const file = path.resolve(
      __dirname,
      `../data/rejection-templates/${query.for}-${param.type}-${query.locale}.json`
    );
    if (!file) throw Error("404 not found");
    const fileBuffer = await fs.readFile(file);
    return JSON.parse(fileBuffer.toString());
  }
}
