import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/hooks/database/base.service";
import {
  ConversationUser,
  ConversationUserDocument,
} from "./schemas/conversation-user.schema";

@Injectable()
export class ConversationUserService extends BaseService<ConversationUserDocument> {
  constructor(
    @InjectModel(ConversationUser.name)
    private readonly conversationUserModel: Model<ConversationUserDocument>
  ) {
    super(conversationUserModel);
  }

  async connectUserToConversation(conversationInfo: {
    conversation: string;
    user: string;
    role: string;
    updatedBy?: string;
  }): Promise<ConversationUserDocument> {
    const { conversation, user } = conversationInfo;
    return await this.upsert(
      {
        conversation,
        user,
      },
      Object.assign({ state: "active" }, conversationInfo)
    );
  }
}
