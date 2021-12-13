import {
  MessageHandlerErrorBehavior,
  RabbitSubscribe,
} from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { IMessage } from "src/hooks/rabbitmq/rabbit-base.module";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";
import { DiagnosisService } from "./diagnosis.service";

@Injectable()
export class DiagnosisSubscriber {
  constructor(
    private readonly service: DiagnosisService,
    private readonly rabbitBaseService: RabbitBaseService
  ) {}

  @RabbitSubscribe({
    exchange: "ResourceEvent",
    routingKey: "consultation-server.master.consultation.diagnosis-modified",
    queue: "consultation-server.diagnosis.subscriber.update-favorite",
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
  public async updateFavorite(
    msg: IMessage<any, any>,
    _ctx: Record<string, any>
  ): Promise<any> {
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
}
