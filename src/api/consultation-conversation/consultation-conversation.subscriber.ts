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
import { RabbitBaseSubscriber } from "src/hooks/rabbitmq/rabbit-base.subscriber";
import { PinoLogger } from "nestjs-pino";
import { Consultation } from "../consultation/schemas/consultation.schema";
import { ConversationUserService } from "./conversation-user/conversation-user.service";
import { CLOSED_STATES } from "../consultation/consultation.constant";
import { UpdateChatPolicyMsgDto } from "./dto/update-chat-policy-message.dto";

@Injectable()
export class ConsultationConversationSubscriber extends RabbitBaseSubscriber {
  constructor(
    protected readonly rabbitBaseService: RabbitBaseService,
    protected readonly loggerService: PinoLogger,
    private readonly conversationUserService: ConversationUserService
  ) {
    super(rabbitBaseService, loggerService);
    this.loggerService.setContext(ConsultationConversationSubscriber.name);
  }

  @RabbitSubscribe({
    exchange: "ResourceEvent",
    routingKey: "*.*.Consultation.state-modified",
    queue:
      "consultation-server.consultation-conversation.subscriber.state-modified",
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
  public async updateChatPolicy(
    @Validate(UpdateChatPolicyMsgDto) msg: RabbitMessageDto<any, Consultation>,
    _ctx: Record<string, any>
  ): Promise<any> {
    try {
      const { conversation, state } = msg.data;
      const conversationUsers = await this.conversationUserService.find(
        { conversation },
        null,
        {}
      );

      if ([...CLOSED_STATES, "INCONSULTATION"].includes(state)) {
        await Promise.all(
          conversationUsers.map((user) => {
            user.set({ chatPolicy: "restricted" });
            return user.save();
          })
        );
      }
    } catch (e) {
      this.handleErrorMessage(msg, e);
    }
  }
}
