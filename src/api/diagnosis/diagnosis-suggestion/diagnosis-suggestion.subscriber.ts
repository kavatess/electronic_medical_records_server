import {
  MessageHandlerErrorBehavior,
  RabbitSubscribe,
} from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { PinoLogger } from "nestjs-pino";
import { ConsultationDocument } from "src/api/consultation/schemas/consultation.schema";
import {
  Validate,
  ValidateParameters,
} from "src/decorators/validate-parameters.decorator";
import { RabbitMessageDto } from "src/hooks/rabbitmq/dto/rabbit-message.dto";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";
import { RabbitBaseSubscriber } from "src/hooks/rabbitmq/rabbit-base.subscriber";
import { DiagnosisSuggestionService } from "./diagnosis-suggestion.service";
import { CreateDiagnosisSuggestionMsgDto } from "./dto/create-diagnosis-suggestion-message.dto";

@Injectable()
export class DiagnosisSuggestionSubscriber extends RabbitBaseSubscriber {
  constructor(
    private readonly service: DiagnosisSuggestionService,
    protected readonly rabbitBaseService: RabbitBaseService,
    protected readonly loggerService: PinoLogger
  ) {
    super(rabbitBaseService, loggerService);
    this.loggerService.setContext(DiagnosisSuggestionSubscriber.name);
  }

  @RabbitSubscribe({
    exchange: "ResourceEvent",
    routingKey: "consultation-server.master.Consultation.diagnosis-modified",
    queue:
      "consultation-server.diagnosis-suggestion.subscriber.diagnosis-modified",
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
    @Validate(CreateDiagnosisSuggestionMsgDto)
    msg: RabbitMessageDto<any, ConsultationDocument>,
    _ctx: Record<string, any>
  ): Promise<any> {
    try {
      const { _id, patient, diagnosis, updatedBy } = msg.data;
      await Promise.all(
        diagnosis.map((diag) => {
          return this.service.findOneOrCreate(
            {
              user: patient,
              diagnosis: diag,
              consultation: _id,
            },
            { updatedBy } as any
          );
        })
      );
    } catch (e) {
      this.handleErrorMessage(msg, e);
    }
  }
}
