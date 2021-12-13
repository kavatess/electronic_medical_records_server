import {
  MessageHandlerErrorBehavior,
  RabbitSubscribe,
} from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { IMessage } from "src/hooks/rabbitmq/rabbit-base.module";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";
import { TestRequestService } from "./test-request.service";

@Injectable()
export class TestRequestSubscriber {
  constructor(
    private readonly service: TestRequestService,
    private readonly rabbitBaseService: RabbitBaseService
  ) {}

  @RabbitSubscribe({
    exchange: "ResourceEvent",
    routingKey: "*.*.TestRequest.created",
    queue: "consultation-server.test-request.subscriber.created",
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
    routingKey: "*.*.TestRequest.updated",
    queue: "consultation-server.test-request.subscriber.updated",
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
    routingKey: "*.*.TestRequest.deleted",
    queue: "consultation-server.test-request.subscriber.deleted",
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
