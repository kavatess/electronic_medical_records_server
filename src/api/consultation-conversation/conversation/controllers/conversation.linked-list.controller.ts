import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { ConversationService } from "../conversation.service";
import { CreateConversationDto } from "../dto/create-conversation.dto";
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { ConversationDto } from "../dto/conversation.dto";
import { ApiQueries } from "src/decorators/api-queries.decorator";
import { ApiErrorResponses } from "src/decorators/api-error-responses.decorator";
import { AuthenticatedHeaderGuard } from "src/auth/guards/authenticated-header.guard";
import { CheckPolicies } from "src/auth/casl/check-policy.decorator";
import { Action, AppAbility } from "src/auth/casl/app-ability";
import { PoliciesGuard } from "src/auth/guards/policies.guard";
import { Conversation } from "../schemas/conversation.schema";

const linkedListConfig = {
  orderField: "createdAt",
  groupBy: "_id",
};

@ApiTags("conversation-linked-list")
@UseGuards(AuthenticatedHeaderGuard, PoliciesGuard)
@ApiSecurity("ApiKeyAuth", ["token"])
@Controller("conversation")
export class ConversationLinkedListController {
  constructor(private readonly service: ConversationService) {}

  @Post("linked-list/append")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, Conversation)
  )
  @ApiQueries(["locale"])
  @ApiCreatedResponse({ type: ConversationDto })
  @ApiErrorResponses(["409", "406", "403"])
  async append(
    @Body() item: CreateConversationDto,
    @Req() req: Request
  ): Promise<ConversationDto> {
    const reqUser = req.headers["x-auth-user"] as string;
    const filter = linkedListConfig.groupBy
      ? { [linkedListConfig.groupBy]: item[linkedListConfig.groupBy] }
      : {};

    const position = await this.service.findOne(
      filter,
      linkedListConfig.orderField,
      { sort: `-${linkedListConfig.orderField}` }
    );

    item[linkedListConfig.orderField] = position
      ? position[linkedListConfig.orderField] + 1
      : 1;
    return await this.service.create(item, {
      createdBy: reqUser,
      _cid: req.headers["x-correlation-id"] as string,
    });
  }

  @Post("linked-list/prepend")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, Conversation)
  )
  @ApiQueries(["locale"])
  @ApiCreatedResponse({ type: ConversationDto })
  @ApiErrorResponses(["409", "406", "403"])
  async prepend(
    @Body() item: CreateConversationDto,
    @Req() req: Request
  ): Promise<ConversationDto> {
    const reqUser = req.headers["x-auth-user"] as string;
    const filter = linkedListConfig.groupBy
      ? { [linkedListConfig.groupBy]: item[linkedListConfig.groupBy] }
      : {};

    const position = await this.service.findOne(
      filter,
      linkedListConfig.orderField,
      { sort: `${linkedListConfig.orderField}` }
    );

    item[linkedListConfig.orderField] = position
      ? position[linkedListConfig.orderField] - 1
      : 0;
    return await this.service.create(item, {
      createdBy: reqUser,
      _cid: req.headers["x-correlation-id"] as string,
    });
  }

  @Post("linked-list/position/:number/insert")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, Conversation)
  )
  @ApiQueries(["locale"])
  @ApiParam({ name: "number", type: "number" })
  @ApiCreatedResponse({ type: ConversationDto })
  @ApiErrorResponses(["409", "406", "403"])
  async insert(
    @Param() params: Record<string, number>,
    @Body() item: CreateConversationDto,
    @Req() req: Request
  ): Promise<ConversationDto> {
    const reqUser = req.headers["x-auth-user"] as string;

    const length = await this.service.countDocuments({});
    const filter = linkedListConfig.groupBy
      ? { [linkedListConfig.groupBy]: item[linkedListConfig.groupBy] }
      : {};
    if (params.number < 0) throw Error("409 position number must be positive");

    if (params.number == 0) {
      const position = await this.service.findOne(
        filter,
        linkedListConfig.orderField,
        { sort: `${linkedListConfig.orderField}` }
      );

      item[linkedListConfig.orderField] = position
        ? position[linkedListConfig.orderField] - 1
        : 0;
      return await this.service.create(item, {
        createdBy: reqUser,
        _cid: req.headers["x-correlation-id"] as string,
      });
    }

    if (params.number <= length) {
      const positions = await this.service.find(
        filter,
        linkedListConfig.orderField,
        {
          sort: `${linkedListConfig.orderField}`,
          limit: 2,
          skip: params.number - 1,
        }
      );
      if (positions.length == 2) {
        item[linkedListConfig.orderField] =
          positions.reduce((p: any, c: any) => p + c.order, 0) / 2;
      } else {
        item[linkedListConfig.orderField] = positions[0]
          ? positions[0][linkedListConfig.orderField] + 1
          : 1;
      }

      return await this.service.create(item, {
        createdBy: reqUser,
        _cid: req.headers["x-correlation-id"] as string,
      });
    }

    if (params.number > length) {
      const position = await this.service.findOne(
        filter,
        linkedListConfig.orderField,
        { sort: `-${linkedListConfig.orderField}` }
      );

      item[linkedListConfig.orderField] =
        position[linkedListConfig.orderField] + 1;
      return await this.service.create(item, {
        createdBy: reqUser,
        _cid: req.headers["x-correlation-id"] as string,
      });
    }
  }

  @Put("/:_id/linked-list/position/:number/move")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, Conversation)
  )
  @ApiQueries(["locale"])
  @ApiParam({ name: "number", type: "number" })
  @ApiParam({ name: "_id", type: "string" })
  @ApiCreatedResponse({ type: ConversationDto })
  @ApiErrorResponses(["409", "406", "403"])
  async move(
    @Param() params: Record<string, number>,
    @Req() req: Request
  ): Promise<ConversationDto> {
    const reqUser = req.headers["x-auth-user"] as string;
    const item = await this.service.findOne(
      { _id: params._id },
      `${linkedListConfig.groupBy}`
    );

    const length = await this.service.countDocuments({});
    const filter = linkedListConfig.groupBy
      ? { [linkedListConfig.groupBy]: item[linkedListConfig.groupBy] }
      : {};
    if (params.number < 0) throw Error("409 position number must be positive");

    if (params.number == 0) {
      const position = await this.service.findOne(
        filter,
        linkedListConfig.orderField,
        { sort: `${linkedListConfig.orderField}` }
      );

      item[linkedListConfig.orderField] = position
        ? position[linkedListConfig.orderField] - 1
        : 0;
      return await this.service.save({ _id: params._id }, item, {
        updatedBy: reqUser,
        _cid: req.headers["x-correlation-id"] as string,
      });
    }

    if (params.number <= length) {
      const positions = await this.service.find(
        filter,
        linkedListConfig.orderField,
        {
          sort: `${linkedListConfig.orderField}`,
          limit: 2,
          skip: params.number - 1,
        }
      );
      if (positions.length == 2) {
        item[linkedListConfig.orderField] =
          positions.reduce((p: any, c: any) => p + c.order, 0) / 2;
      } else {
        item[linkedListConfig.orderField] = positions[0]
          ? positions[0][linkedListConfig.orderField] + 1
          : 1;
      }

      return await this.service.save({ _id: params._id }, item, {
        updatedBy: reqUser,
        _cid: req.headers["x-correlation-id"] as string,
      });
    }

    if (params.number > length) {
      const position = await this.service.findOne(
        filter,
        linkedListConfig.orderField,
        { sort: `-${linkedListConfig.orderField}` }
      );

      item[linkedListConfig.orderField] =
        position[linkedListConfig.orderField] + 1;
      return await this.service.save({ _id: params._id }, item, {
        updatedBy: reqUser,
        _cid: req.headers["x-correlation-id"] as string,
      });
    }
  }

  @Put("linked-list/:from/:to/position-switch")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, Conversation)
  )
  @ApiQueries(["locale"])
  @ApiParam({
    name: "from",
    type: "string",
    description: "_id of conversation to switch",
  })
  @ApiParam({
    name: "to",
    type: "string",
    description: "_id of conversation to switch",
  })
  @ApiCreatedResponse({ type: ConversationDto })
  @ApiErrorResponses(["409", "406", "403"])
  async positionSwitch(
    @Param() params: Record<string, string>
  ): Promise<ConversationDto[]> {
    const output = [];
    const fromRecord = await this.service.findOne(
      { _id: params.from },
      `_id ${linkedListConfig.orderField}`
    );
    const toRecord = await this.service.findOne(
      { _id: params.to },
      `_id ${linkedListConfig.orderField}`
    );
    output.push(
      await this.service.save(
        { _id: fromRecord._id },
        { [linkedListConfig.orderField]: toRecord[linkedListConfig.orderField] }
      )
    );
    output.push(
      await this.service.save(
        { _id: toRecord._id },
        {
          [linkedListConfig.orderField]:
            fromRecord[linkedListConfig.orderField],
        }
      )
    );
    return output;
  }

  @Put("linked-list/reorder")
  @ApiOkResponse({})
  @ApiQueries(["locale"])
  async reorder(): Promise<string[]> {
    const groupBys = await this.service.distinct(
      {},
      `${linkedListConfig.groupBy}`
    );
    groupBys.forEach(async (groupby) => {
      let i = 0;
      this.service
        .cursor(
          { [linkedListConfig.groupBy]: groupby },
          { sort: `${linkedListConfig.orderField}` }
        )
        .eachAsync(async (item) => {
          await this.service.save(
            { _id: item._id },
            { [linkedListConfig.orderField]: i }
          );
          i++;
        });
    });
    return groupBys;
  }
}
