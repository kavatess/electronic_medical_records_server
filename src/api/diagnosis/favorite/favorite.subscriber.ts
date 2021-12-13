import {
  MessageHandlerErrorBehavior,
  RabbitSubscribe,
} from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { ConsultationDocument } from "src/api/consultation/schemas/consultation.schema";
import {
  Validate,
  ValidateParameters,
} from "src/decorators/validate-parameters.decorator";
import { RabbitMessageDto } from "src/hooks/rabbitmq/dto/rabbit-message.dto";
import { CreateFavoriteDiagnosisMsgDto } from "./dto/create-favorite-diagnosis-message.dto";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";
import { FavoriteService } from "./favorite.service";
import { RabbitBaseSubscriber } from "src/hooks/rabbitmq/rabbit-base.subscriber";
import { PinoLogger } from "nestjs-pino";

@Injectable()
export class FavoriteSubscriber extends RabbitBaseSubscriber {
  constructor(
    private readonly service: FavoriteService,
    protected readonly rabbitBaseService: RabbitBaseService,
    protected readonly loggerService: PinoLogger
  ) {
    super(rabbitBaseService, loggerService);
    this.loggerService.setContext(FavoriteSubscriber.name);
  }

  @RabbitSubscribe({
    exchange: "ResourceEvent",
    routingKey: "consultation-server.master.Consultation.diagnosis-modified",
    queue: "consultation-server.favorite.subscriber.diagnosis-modified",
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
  @ValidateParameters()
  public async create(
    @Validate(CreateFavoriteDiagnosisMsgDto)
    msg: RabbitMessageDto<any, ConsultationDocument>,
    _ctx: Record<string, any>
  ): Promise<void> {
    try {
      const { providerUser, diagnosis } = msg.data;
      await this.service.createFavoriteDiagnosis(providerUser, diagnosis);
    } catch (e) {
      this.handleErrorMessage(msg, e);
    }
  }
}
