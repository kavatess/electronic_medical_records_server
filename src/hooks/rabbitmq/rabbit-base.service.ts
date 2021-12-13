import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { RabbitMessageDto } from "./dto/rabbit-message.dto";

@Injectable()
export class RabbitBaseService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  public async publish(
    exchange: string,
    _routingKey: string,
    body: RabbitMessageDto<any, any>
  ): Promise<void> {
    return await this.amqpConnection.publish(
      exchange,
      _routingKey,
      Object.assign({ _routingKey }, body)
    );
  }

  public async sendToQueue(
    queue: string,
    data: Record<string, any>
  ): Promise<void> {
    return await this.amqpConnection.channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(data))
    );
  }

  public get amqpConnect(): AmqpConnection {
    return this.amqpConnection;
  }
}
