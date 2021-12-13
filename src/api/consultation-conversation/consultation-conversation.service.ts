import { Injectable } from "@nestjs/common";
import { ConsultationDto } from "../consultation/dto/consultation.dto";
import { ChannelService } from "./channel/channel.service";
import { ConversationUserService } from "./conversation-user/conversation-user.service";
import { ConversationService } from "./conversation/conversation.service";
import { ConversationDocument } from "./conversation/schemas/conversation.schema";

@Injectable()
export class ConsultationConversationService {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly channelService: ChannelService,
    private readonly conversationUserService: ConversationUserService
  ) {}

  async createConversationForConsult({
    provider,
    patient,
    user,
    providerUser,
  }: ConsultationDto): Promise<ConversationDocument> {
    const onemrChannel = await this.channelService.createProviderOnemrChannel(
      provider
    );
    const conversation = await this.conversationService.findOneOrCreate({
      channel: onemrChannel._id,
      user: patient,
    });
    await Promise.all([
      this.conversationUserService.connectUserToConversation({
        conversation: conversation._id,
        user: user,
        role: "user",
      }),
      this.conversationUserService.connectUserToConversation({
        conversation: conversation._id,
        user: patient,
        role: "patient",
      }),
      this.conversationUserService.connectUserToConversation({
        conversation: conversation._id,
        user: providerUser,
        role: "owner",
      }),
    ]);
    return conversation;
  }
}
