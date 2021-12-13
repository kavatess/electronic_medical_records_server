import {
  MessageHandlerErrorBehavior,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { IMessage } from 'src/hooks/rabbitmq/rabbit-base.module';
import { RabbitBaseService } from 'src/hooks/rabbitmq/rabbit-base.service';
import { EmployeeService } from './employee.service';

@Injectable()
export class EmployeeSubscriber {
  constructor(
    private readonly service: EmployeeService,
    private readonly rabbitBaseService: RabbitBaseService
  ) {}

  @RabbitSubscribe({
    exchange: 'ResourceEvent',
    routingKey: '*.*.Employee.created',
    queue: 'nestjs-starter.employee.subscriber.created',
    queueOptions: {
      exclusive: false,
      durable: true,
      autoDelete: true,
      // arguments: {};
      messageTtl: 1000 * 60 * 60 * 24,
      // deadLetterExchange: 'reject-publish';
      // deadLetterRoutingKey?: string;
      maxLength: 100000,
      maxPriority: 10,
    },
    errorBehavior: MessageHandlerErrorBehavior.NACK,
  })
  public async created(
    msg: IMessage<any, any>,
    ctx: Record<string, any>
  ): Promise<any> {
    if (ctx.fields.routingKey.split('.')[0] == 'nestjs-starter') return;
    try {
      await this.service.create(msg.data);
    } catch (e) {
      this.rabbitBaseService.publish('ResourceEvent', 'nestjs-starter.error', {
        ...msg,
        _error: e.message,
      });
    }
  }

  @RabbitSubscribe({
    exchange: 'ResourceEvent',
    routingKey: '*.*.Employee.updated',
    queue: 'nestjs-starter.employee.subscriber.updated',
    queueOptions: {
      exclusive: false,
      durable: true,
      autoDelete: true,
      // arguments: {};
      messageTtl: 1000 * 60 * 60 * 24,
      // deadLetterExchange: 'reject-publish';
      // deadLetterRoutingKey?: string;
      maxLength: 100000,
      maxPriority: 10,
    },
    errorBehavior: MessageHandlerErrorBehavior.NACK,
  })
  public async updated(
    msg: IMessage<any, any>,
    ctx: Record<string, any>
  ): Promise<any> {
    if (ctx.fields.routingKey.split('.')[0] == 'nestjs-starter') return;
    try {
      await this.service.save({ _id: msg.query._id }, msg.data);
    } catch (e) {
      this.rabbitBaseService.publish('ResourceEvent', 'nestjs-starter.error', {
        ...msg,
        _error: e.message,
      });
    }
  }

  @RabbitSubscribe({
    exchange: 'ResourceEvent',
    routingKey: '*.*.Employee.deleted',
    queue: 'nestjs-starter.employee.subscriber.deleted',
    queueOptions: {
      exclusive: false,
      durable: true,
      autoDelete: true,
      // arguments: {};
      messageTtl: 1000 * 60 * 60 * 24,
      // deadLetterExchange: 'reject-publish';
      // deadLetterRoutingKey?: string;
      maxLength: 100000,
      maxPriority: 10,
    },
    errorBehavior: MessageHandlerErrorBehavior.NACK,
  })
  public async deleted(
    msg: IMessage<any, any>,
    ctx: Record<string, any>
  ): Promise<any> {
    if (ctx.fields.routingKey.split('.')[0] == 'nestjs-starter') return;
    try {
      this.service.remove({ _id: msg.query._id });
    } catch (e) {
      this.rabbitBaseService.publish('ResourceEvent', 'nestjs-starter.error', {
        ...msg,
        _error: e.message,
      });
    }
  }
}
