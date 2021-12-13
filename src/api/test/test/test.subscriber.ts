import {
  MessageHandlerErrorBehavior,
  RabbitSubscribe,
} from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { IMessage } from "src/hooks/rabbitmq/rabbit-base.module";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";
import { TestService } from "./test.service";

@Injectable()
export class TestSubscriber {
  constructor(
    private readonly service: TestService,
    private readonly rabbitBaseService: RabbitBaseService
  ) {}

  @RabbitSubscribe({
    exchange: "ResourceEvent",
    routingKey: "*.*.Test.created",
    queue: "consultation-server.test.subscriber.created",
    queueOptions: {
      exclusive: false,
      durable: true,
      autoDelete: true,
      messageTtl: 1000 * 60 * 60 * 24,
      maxLength: 100000,
      maxPriority: 10,
    },
    errorBehavior: MessageHandlerErrorBehavior.NACK,
  })
  public async created(
    msg: IMessage<any, any>,
    ctx: Record<string, any>
  ): Promise<any> {
    if (ctx.fields.routingKey.split(".")[0] == "consultation-server") return;
    try {
      await this.service.create(msg.data);
    } catch (e) {
      this.rabbitBaseService.publish(
        "ResourceEvent",
        "consultation-server.error",
        {
          ...msg,
          _error: e.message,
        }
      );
    }
  }

  @RabbitSubscribe({
    exchange: "ResourceEvent",
    routingKey: "*.*.Test.updated",
    queue: "consultation-server.test.subscriber.updated",
    queueOptions: {
      exclusive: false,
      durable: true,
      autoDelete: true,
      messageTtl: 1000 * 60 * 60 * 24,
      maxLength: 100000,
      maxPriority: 10,
    },
    errorBehavior: MessageHandlerErrorBehavior.NACK,
  })
  public async updated(
    msg: IMessage<any, any>,
    ctx: Record<string, any>
  ): Promise<any> {
    if (ctx.fields.routingKey.split(".")[0] == "consultation-server") return;
    try {
      await this.service.save({ _id: msg.query._id }, msg.data);
    } catch (e) {
      this.rabbitBaseService.publish(
        "ResourceEvent",
        "consultation-server.error",
        {
          ...msg,
          _error: e.message,
        }
      );
    }
  }

  @RabbitSubscribe({
    exchange: "ResourceEvent",
    routingKey: "*.*.Test.deleted",
    queue: "consultation-server.test.subscriber.deleted",
    queueOptions: {
      exclusive: false,
      durable: true,
      autoDelete: true,
      messageTtl: 1000 * 60 * 60 * 24,
      maxLength: 100000,
      maxPriority: 10,
    },
    errorBehavior: MessageHandlerErrorBehavior.NACK,
  })
  public async deleted(
    msg: IMessage<any, any>,
    ctx: Record<string, any>
  ): Promise<any> {
    if (ctx.fields.routingKey.split(".")[0] == "consultation-server") return;
    try {
      this.service.remove({ _id: msg.query._id });
    } catch (e) {
      this.rabbitBaseService.publish(
        "ResourceEvent",
        "consultation-server.error",
        {
          ...msg,
          _error: e.message,
        }
      );
    }
  }
}
