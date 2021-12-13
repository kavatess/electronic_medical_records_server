import {
  Body,
  Controller,
  Delete,
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
import { PrescriptionService } from "../prescription.service";
import { CreatePrescriptionDto } from "../dto/create-prescription.dto";
import { UpdatePrescriptionDto } from "../dto/update-prescription.dto";
import {
  ApiAcceptedResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { PrescriptionDto } from "../dto/prescription.dto";
import { ApiQueries } from "src/decorators/api-queries.decorator";
import { KheSchema } from "src/decorators/khe-schema.decorator";
import { ApiErrorResponses } from "src/decorators/api-error-responses.decorator";
import { AuthenticatedHeaderGuard } from "src/auth/guards/authenticated-header.guard";
import { ArrayUpdatePrescriptionDto } from "../dto/array-update-prescription.dto";
import { CheckPolicies } from "src/auth/casl/check-policy.decorator";
import { Action, AppAbility } from "src/auth/casl/app-ability";
import { PoliciesGuard } from "src/auth/guards/policies.guard";
import { Prescription } from "../schemas/prescription.schema";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";

@ApiTags("prescription")
@UseGuards(AuthenticatedHeaderGuard, PoliciesGuard)
@ApiSecurity("ApiKeyAuth", ["token"])
@Controller("prescription")
export class PrescriptionController {
  constructor(
    private readonly service: PrescriptionService,
    private readonly rabbitBaseService: RabbitBaseService
  ) {}

  @Post()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, Prescription)
  )
  @ApiQueries(["locale"])
  @ApiCreatedResponse({ type: Prescription })
  @ApiErrorResponses(["409", "406", "403"])
  async create(
    @Body() item: CreatePrescriptionDto,
    @Req() req: Request
  ): Promise<Prescription> {
    const reqUser = req.headers["x-auth-user"] as string;
    return await this.service.create(item, {
      createdBy: reqUser,
      updatedBy: reqUser,
    });
  }

  @Post("/find-or-create")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, Prescription)
  )
  @ApiQueries(["locale"])
  @ApiCreatedResponse({ type: Prescription })
  @ApiErrorResponses(["409", "406", "403"])
  async findOrCreate(
    @Body() item: CreatePrescriptionDto,
    @Req() req: Request
  ): Promise<Prescription> {
    const reqUser = req.headers["x-auth-user"] as string;
    return await this.service.findOneOrCreate(item, {
      createdBy: reqUser,
      updatedBy: reqUser,
    });
  }

  @Post("/import/create")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, Prescription)
  )
  @ApiQueries(["locale"])
  @ApiCreatedResponse({ type: PrescriptionDto, isArray: true })
  @ApiErrorResponses(["409", "406", "403"])
  async importCreate(
    @Body() items: CreatePrescriptionDto[],
    @Req() req: Request
  ): Promise<PrescriptionDto[]> {
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
    ability.can(Action.Create, Prescription)
  )
  @ApiQueries(["locale"])
  @ApiCreatedResponse({ type: PrescriptionDto, isArray: true })
  @ApiErrorResponses(["409", "406", "403"])
  async importUpdate(
    @Body() items: CreatePrescriptionDto[],
    @Req() req: Request
  ): Promise<PrescriptionDto[]> {
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
    ability.can(Action.Read, Prescription)
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
    ability.can(Action.Read, Prescription)
  )
  @ApiOkResponse({ type: Prescription, isArray: true })
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
  async findAll(@Query() query: Record<string, any>): Promise<Prescription[]> {
    const filter = query.filter ? JSON.parse(query.filter) : {};
    const item = await this.service.find(filter, query.fields, query);
    if (query.count) {
      item["_countDocuments"] = await this.service.countDocuments(filter);
    }
    return item;
  }

  @Get("search")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, Prescription)
  )
  @ApiErrorResponses(["403"])
  @KheSchema({
    dto: "PrescriptionDto",
    labelField: "_id",
    searchFields: ["unit", "note"],
    filterFields: [
      "user",
      "consultation",
      "drug",
      "route",
      "take",
      "unit",
      "total",
      "duration",
      "frequency",
      "note",
      "followDirection",
    ],
    sortFields: [
      "user",
      "consultation",
      "drug",
      "route",
      "take",
      "unit",
      "total",
      "duration",
      "frequency",
      "note",
      "followDirection",
    ],
    defaultSort: ["-updatedAt"],
    view: "table",
    initialFields: ["user", "consultation", "drug", "total"],
  })
  @ApiOkResponse({ type: Prescription, isArray: true })
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
  async list(@Query() query: Record<string, any>): Promise<Prescription[]> {
    const filter = query.filter ? JSON.parse(query.filter) : {};
    const item = await this.service.find(filter, query.fields, query);
    if (query.count) {
      item["_countDocuments"] = await this.service.countDocuments(filter);
    }
    return item;
  }

  @Get("csv/download")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, Prescription)
  )
  @ApiErrorResponses(["403"])
  @ApiOkResponse({ type: PrescriptionDto, isArray: true })
  @ApiQueries(["fields", "populate", "filter", "sort", "skip", "limit"])
  async download(
    @Query() query: Record<string, any>,
    @Res() res: Response
  ): Promise<any> {
    const filter = query.filter ? JSON.parse(query.filter) : {};
    res.header("Content-Type", "text/csv");
    res.attachment("prescription.csv");
    res.send(await this.service.getCsv(filter, query.fields, query));
  }

  @Post("publish/:exchange/:topic")
  @ApiParam({ name: "exchange", type: String, required: true })
  @ApiParam({ name: "topic", type: String, required: true })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Manage, Prescription)
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
    ability.can(Action.Read, Prescription)
  )
  @ApiErrorResponses(["404", "403"])
  @ApiOkResponse({ type: Prescription, content: {} })
  @ApiParam({ name: "_id", type: String, required: true })
  @ApiQueries(["fields", "locale", "populate"])
  async getById(
    @Query() query: Record<string, any>,
    @Param() params: Record<string, string>
  ): Promise<Prescription> {
    const item = this.service.findOne(params, query.fields, query);
    if (!item) throw "404 item not found";
    return item;
  }

  @Put(":_id")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, Prescription)
  )
  @ApiOkResponse({ type: Prescription })
  @ApiErrorResponses(["404", "403"])
  @ApiQueries(["fields", "locale", "populate"])
  @ApiParam({ name: "_id", type: String, required: true })
  async updateById(
    @Param() params: { [key: string]: string },
    @Body() data: UpdatePrescriptionDto,
    @Req() req: Request
  ): Promise<Prescription> {
    return this.service.save(params, data, {
      updatedBy: req.headers["x-auth-user"] as string,
    });
  }

  @Put(":_id/add-to-set")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, Prescription)
  )
  @ApiOkResponse({ type: Prescription })
  @ApiErrorResponses(["404", "403"])
  @ApiQueries(["fields", "locale", "populate"])
  @ApiParam({ name: "_id", type: String, required: true })
  async updateByIdAddToSet(
    @Param() params: Record<string, string>,
    @Body() data: ArrayUpdatePrescriptionDto,
    @Req() req: Request
  ): Promise<Prescription> {
    return this.service.addToSet(params, data, {
      updatedBy: req.headers["x-auth-user"] as string,
    });
  }

  @Put(":_id/pull")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, Prescription)
  )
  @ApiOkResponse({ type: Prescription })
  @ApiErrorResponses(["404", "403"])
  @ApiQueries(["fields", "locale", "populate"])
  @ApiParam({ name: "_id", type: String, required: true })
  async updateByIdPull(
    @Param() params: Record<string, string>,
    @Body() data: ArrayUpdatePrescriptionDto,
    @Req() req: Request
  ): Promise<Prescription> {
    return this.service.pull(params, data, {
      updatedBy: req.headers["x-auth-user"] as string,
    });
  }

  @Put(":_id/push")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, Prescription)
  )
  @ApiOkResponse({ type: Prescription })
  @ApiErrorResponses(["404", "403"])
  @ApiQueries(["fields", "locale", "populate"])
  @ApiParam({ name: "_id", type: String, required: true })
  async updateByIdPush(
    @Param() params: Record<string, string>,
    @Body() data: ArrayUpdatePrescriptionDto,
    @Req() req: Request
  ): Promise<Prescription> {
    return this.service.push(params, data, {
      updatedBy: req.headers["x-auth-user"] as string,
    });
  }

  @Delete(":_id")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Delete, Prescription)
  )
  @ApiOkResponse({ type: Prescription })
  @ApiErrorResponses(["404", "403"])
  @ApiQueries(["locale"])
  @ApiParam({ name: "_id", type: String, required: true })
  async removeById(
    @Param() params: Record<string, string>
  ): Promise<Prescription> {
    return await this.service.remove(params);
  }
}
