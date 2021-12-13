import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/hooks/database/base.service";
import {
  Conversation,
  ConversationDocument,
} from "./schemas/conversation.schema";

@Injectable()
export class ConversationService extends BaseService<ConversationDocument> {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<ConversationDocument>
  ) {
    super(conversationModel);
  }
}
