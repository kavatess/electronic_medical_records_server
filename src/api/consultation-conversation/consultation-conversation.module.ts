import { Module } from "@nestjs/common";
import { ChannelModule } from "./channel/channel.module";
import { ConversationModule } from "./conversation/conversation.module";
import { ConversationUserModule } from "./conversation-user/conversation-user.module";
import { ConsultationConversationService } from "./consultation-conversation.service";

@Module({
  imports: [ChannelModule, ConversationModule, ConversationUserModule],
  controllers: [],
  providers: [ConsultationConversationService],
  exports: [ConsultationConversationService],
})
export class ConsultationConversationModule {}
