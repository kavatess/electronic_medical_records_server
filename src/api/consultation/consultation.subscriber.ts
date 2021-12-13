import {
  MessageHandlerErrorBehavior,
  RabbitSubscribe,
} from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";
import {
  ValidateParameters,
  Validate,
} from "src/decorators/validate-parameters.decorator";
import { RabbitMessageDto } from "src/hooks/rabbitmq/dto/rabbit-message.dto";
import {
  CreateConsultationMsgBody,
  CreateConsultationMsgDto,
} from "./dto/create-consultation-message.dto";
import { RabbitBaseSubscriber } from "src/hooks/rabbitmq/rabbit-base.subscriber";
import { PinoLogger } from "nestjs-pino";
import { CreateConsultationFactoryService } from "./services/create-consultation.factory.service";

@Injectable()
export class ConsultationSubscriber extends RabbitBaseSubscriber {
  constructor(
    protected readonly rabbitBaseService: RabbitBaseService,
    protected readonly loggerService: PinoLogger,
    private readonly createConsultFactory: CreateConsultationFactoryService
  ) {
    super(rabbitBaseService, loggerService);
    this.loggerService.setContext(ConsultationSubscriber.name);
  }

  @RabbitSubscribe({
    exchange: "amq.direct",
    routingKey: "#",
    queue: "consultation",
    queueOptions: {},
    errorBehavior: MessageHandlerErrorBehavior.NACK,
  })
  @ValidateParameters()
  public async createConsultation(
    @Validate(CreateConsultationMsgDto)
    msg: RabbitMessageDto<any, CreateConsultationMsgBody>,
    ctx: Record<string, any>
  ): Promise<void> {
    this.loggerService.debug({
      msg: "consultation message recevied",
      data: msg,
    });
    if (ctx.fields.routingKey.split(".")[0] == "consultation-server") return;
    try {
      const consult = msg.body.data;
      await this.createConsultFactory.getService(consult.type).create(consult);
    } catch (e) {
      this.handleErrorMessage(msg, e);
    }
  }
}
