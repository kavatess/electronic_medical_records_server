import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Request, Response } from "express";
import { ConsultationService } from "../services/consultation.service";
import { CreateConsultationDto } from "../dto/create-consultation.dto";
import { UpdateConsultationDto } from "../dto/update-consultation.dto";
import {
  ApiAcceptedResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { ConsultationDto } from "../dto/consultation.dto";
import { ApiQueries } from "src/decorators/api-queries.decorator";
import { KheSchema } from "src/decorators/khe-schema.decorator";
import { ApiErrorResponses } from "src/decorators/api-error-responses.decorator";
import { AuthenticatedHeaderGuard } from "src/auth/guards/authenticated-header.guard";
import { ArrayUpdateConsultationDto } from "../dto/array-update-consultation.dto";
import { CheckPolicies } from "src/auth/casl/check-policy.decorator";
import { Action, AppAbility } from "src/auth/casl/app-ability";
import { PoliciesGuard } from "src/auth/guards/policies.guard";
import { Consultation } from "../schemas/consultation.schema";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";

@ApiTags("consultation")
@UseGuards(AuthenticatedHeaderGuard, PoliciesGuard)
@ApiSecurity("ApiKeyAuth", ["token"])
@Controller("consultation")
export class ConsultationController {
  constructor(
    private readonly service: ConsultationService,
    private readonly rabbitBaseService: RabbitBaseService
  ) {}

  @Post()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, Consultation)
  )
  @ApiQueries(["locale"])
  @ApiCreatedResponse({ type: Consultation })
  @ApiErrorResponses(["409", "406", "403"])
  async create(
    @Body() item: CreateConsultationDto,
    @Req() req: Request
  ): Promise<Consultation> {
    const reqUser = req.headers["x-auth-user"] as string;
    return await this.service.create(item, {
      createdBy: reqUser,
      updatedBy: reqUser,
    });
  }

  @Post("/find-or-create")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, Consultation)
  )
  @ApiQueries(["locale"])
  @ApiCreatedResponse({ type: Consultation })
  @ApiErrorResponses(["409", "406", "403"])
  async findOrCreate(
    @Body() item: CreateConsultationDto,
    @Req() req: Request
  ): Promise<Consultation> {
    const reqUser = req.headers["x-auth-user"] as string;
    return await this.service.findOneOrCreate(item, {
      createdBy: reqUser,
      updatedBy: reqUser,
    });
  }

  @Post("/import/create")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, Consultation)
  )
  @ApiQueries(["locale"])
  @ApiCreatedResponse({ type: ConsultationDto, isArray: true })
  @ApiErrorResponses(["409", "406", "403"])
  async importCreate(
    @Body() items: CreateConsultationDto[],
    @Req() req: Request
  ): Promise<ConsultationDto[]> {
    const reqUser = req.headers["x-auth-user"] as string;
    const response = [];
    for (const item of items) {
      const output = {};
      try {
        output["_id"] = (
          await this.service.create(item, {
            createdBy: reqUser,
            updatedBy: reqUser,
          })
        )._id;
        output["success"] = true;
      } catch (e) {
        output["success"] = false;
        output["message"] = e.message;
      }
      response.push(output);

      this.rabbitBaseService.sendToQueue("socket-worker", {
        namespace: "/User",
        event: "import-result",
        room: reqUser,
        data: [output],
      });
    }
    return response;
  }

  @Post("/import/update")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, Consultation)
  )
  @ApiQueries(["locale"])
  @ApiCreatedResponse({ type: ConsultationDto, isArray: true })
  @ApiErrorResponses(["409", "406", "403"])
  async importUpdate(
    @Body() items: CreateConsultationDto[],
    @Req() req: Request
  ): Promise<ConsultationDto[]> {
    const reqUser = req.headers["x-auth-user"] as string;
    const response = [];
    for (const item of items) {
      const output = {};
      try {
        output["_id"] = (
          await this.service.save({ _id: item._id }, item, {
            updatedBy: req.headers["x-auth-user"] as string,
          })
        )._id;
        output["success"] = true;
      } catch (e) {
        output["success"] = false;
        output["message"] = e.message;
      }
      response.push(output);

      this.rabbitBaseService.sendToQueue("socket-worker", {
        namespace: "/User",
        event: "import-result",
        room: reqUser,
        data: [output],
      });
    }
    return response;
  }

  @Get("count")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, Consultation)
  )
  @ApiOkResponse({ type: Number })
  @ApiQueries(["locale", "filter"])
  @ApiErrorResponses(["403"])
  async count(@Query() query: Record<string, any>): Promise<number> {
    const filter = query.filter ? JSON.parse(query.filter) : {};
    return this.service.countDocuments(filter);
  }

  @Get()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, Consultation)
  )
  @ApiOkResponse({ type: Consultation, isArray: true })
  @ApiErrorResponses(["403"])
  @ApiQueries([
    "fields",
    "locale",
    "populate",
    "sort",
    "skip",
    "limit",
    "count",
  ])
  async findAll(@Query() query: Record<string, any>): Promise<Consultation[]> {
    const filter = query.filter ? JSON.parse(query.filter) : {};
    const item = await this.service.find(filter, query.fields, query);
    if (query.count) {
      item["_countDocuments"] = await this.service.countDocuments(filter);
    }
    return item;
  }

  @Get("search")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, Consultation)
  )
  @ApiErrorResponses(["403"])
  @KheSchema({
    dto: "ConsultationDto",
    labelField: "chiefComplaint",
    searchFields: [
      "tags",
      "type",
      "medium",
      "state",
      "chiefComplaint",
      "symptom",
      "altDiagnoses",
      "note",
      "reason",
      "questions",
      "noteAudio",
      "metaString",
      "comment",
    ],
    filterFields: [
      "test",
      "tags",
      "noneDrug",
      "provider",
      "providerUser",
      "user",
      "patient",
      "type",
      "medium",
      "consultTime",
      "state",
      "shortLink",
      "orderItem",
      "order",
      "closedAt",
      "treatmentEndedAt",
      "chiefComplaint",
      "symptom",
      "diagnosis",
      "altDiagnoses",
      "note",
      "conversation",
      "followUpQuestion",
      "reason",
      "questions",
      "noteAudio",
      "transferred",
      "cancelledBy",
      "metaString",
      "comment",
      "form",
    ],
    sortFields: [
      "test",
      "tags",
      "noneDrug",
      "provider",
      "providerUser",
      "user",
      "patient",
      "type",
      "medium",
      "consultTime",
      "state",
      "shortLink",
      "orderItem",
      "order",
      "closedAt",
      "treatmentEndedAt",
      "chiefComplaint",
      "symptom",
      "diagnosis",
      "altDiagnoses",
      "note",
      "conversation",
      "followUpQuestion",
      "reason",
      "questions",
      "noteAudio",
      "transferred",
      "cancelledBy",
      "metaString",
      "comment",
      "metadata",
    ],
    defaultSort: ["-time"],
    view: "table",
    initialFields: [
      "chiefComplaint",
      "provider",
      "patient",
      "updatedBy",
      "updatedAt",
    ],
  })
  @ApiOkResponse({ type: Consultation, isArray: true })
  @ApiQueries([
    "fields",
    "locale",
    "populate",
    "filter",
    "sort",
    "skip",
    "limit",
    "count",
  ])
  async list(@Query() query: Record<string, any>): Promise<Consultation[]> {
    const filter = query.filter ? JSON.parse(query.filter) : {};
    const item = await this.service.find(filter, query.fields, query);
    if (query.count) {
      item["_countDocuments"] = await this.service.countDocuments(filter);
    }
    return item;
  }

  @Post("search")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, Consultation)
  )
  @ApiErrorResponses(["400", "403"])
  @ApiOkResponse({ type: Consultation, isArray: true })
  @ApiQueries([
    "fields",
    "locale",
    "populate",
    "filter",
    "sort",
    "skip",
    "limit",
    "count",
  ])
  async search(@Query() query: Record<string, any>): Promise<Consultation[]> {
    const filter = query.filter ? JSON.parse(query.filter) : {};
    const item = await this.service.find(filter, query.fields, query);
    if (query.count) {
      item["_countDocuments"] = await this.service.countDocuments(filter);
    }
    return item;
  }

  @Get("csv/download")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, Consultation)
  )
  @ApiErrorResponses(["403"])
  @ApiOkResponse({ type: ConsultationDto, isArray: true })
  @ApiQueries(["fields", "populate", "filter", "sort", "skip", "limit"])
  async download(
    @Query() query: Record<string, any>,
    @Res() res: Response
  ): Promise<any> {
    const filter = query.filter ? JSON.parse(query.filter) : {};
    res.header("Content-Type", "text/csv");
    res.attachment("consultation.csv");
    res.send(await this.service.getCsv(filter, query.fields, query));
  }

  @Post("publish/:exchange/:topic")
  @ApiParam({ name: "exchange", type: String, required: true })
  @ApiParam({ name: "topic", type: String, required: true })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Manage, Consultation)
  )
  @ApiErrorResponses(["403"])
  @ApiQueries(["batchSize", "populate"])
  @ApiAcceptedResponse()
  async publish(
    @Body() filter: Record<string, any>,
    @Query() query: Record<string, any>,
    @Param() params: Record<string, string>
  ): Promise<any> {
    this.service.cursor(filter, query).eachAsync((item) => {
      this.rabbitBaseService.publish(params.exchange, params.topic, {
        query: { _id: item._id },
        data: item,
      });
    });
    return { ack: true };
  }

  @Get(":_id")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, Consultation)
  )
  @ApiErrorResponses(["404", "403"])
  @ApiOkResponse({ type: Consultation, content: {} })
  @ApiParam({ name: "_id", type: String, required: true })
  @ApiQueries(["fields", "locale", "populate"])
  async getById(
    @Query() query: Record<string, any>,
    @Param() params: Record<string, string>
  ): Promise<Consultation> {
    const item = this.service.findOne(params, query.fields, query);
    if (!item) throw "404 item not found";
    return item;
  }

  @Put(":_id")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, Consultation)
  )
  @ApiOkResponse({ type: Consultation })
  @ApiErrorResponses(["404", "403"])
  @ApiQueries(["fields", "locale", "populate"])
  @ApiParam({ name: "_id", type: String, required: true })
  async updateById(
    @Param() params: { [key: string]: string },
    @Body() data: UpdateConsultationDto,
    @Req() req: Request
  ): Promise<Consultation> {
    return this.service.save(params, data, {
      updatedBy: req.headers["x-auth-user"] as string,
    });
  }

  @Put(":_id/add-to-set")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, Consultation)
  )
  @ApiOkResponse({ type: Consultation })
  @ApiErrorResponses(["404", "403"])
  @ApiQueries(["fields", "locale", "populate"])
  @ApiParam({ name: "_id", type: String, required: true })
  async updateByIdAddToSet(
    @Param() params: Record<string, string>,
    @Body() data: ArrayUpdateConsultationDto,
    @Req() req: Request
  ): Promise<Consultation> {
    return this.service.addToSet(params, data, {
      updatedBy: req.headers["x-auth-user"] as string,
    });
  }

  @Put(":_id/pull")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, Consultation)
  )
  @ApiOkResponse({ type: Consultation })
  @ApiErrorResponses(["404", "403"])
  @ApiQueries(["fields", "locale", "populate"])
  @ApiParam({ name: "_id", type: String, required: true })
  async updateByIdPull(
    @Param() params: Record<string, string>,
    @Body() data: ArrayUpdateConsultationDto,
    @Req() req: Request
  ): Promise<Consultation> {
    return this.service.pull(params, data, {
      updatedBy: req.headers["x-auth-user"] as string,
    });
  }

  @Put(":_id/push")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, Consultation)
  )
  @ApiOkResponse({ type: Consultation })
  @ApiErrorResponses(["404", "403"])
  @ApiQueries(["fields", "locale", "populate"])
  @ApiParam({ name: "_id", type: String, required: true })
  async updateByIdPush(
    @Param() params: Record<string, string>,
    @Body() data: ArrayUpdateConsultationDto,
    @Req() req: Request
  ): Promise<Consultation> {
    return this.service.push(params, data, {
      updatedBy: req.headers["x-auth-user"] as string,
    });
  }

  @Post("queue/send")
  @ApiParam({ name: "queueName", type: String, required: true })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Manage, Consultation)
  )
  @ApiErrorResponses(["400", "403"])
  @ApiAcceptedResponse()
  async sendToQueue(@Body() body: CreateConsultationDto): Promise<any> {
    await this.rabbitBaseService.sendToQueue("consultation", body);
    return { ack: true };
  }
}
