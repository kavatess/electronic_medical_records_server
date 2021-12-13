import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { IBaseSchema } from "src/hooks/database/schema/base.schema";
import { TYPE_ENUM } from "../conversation.module";

export type ConversationDocument = Conversation & Document;

@Schema({ timestamps: true })
export class Conversation extends IBaseSchema {
  @Prop({ type: String })
  name: string;

  @Prop({ type: Types.ObjectId, ref: "Channel", required: true })
  channel: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  user: string;

  @Prop({ type: String, enum: TYPE_ENUM, default: "peer-to-peer" })
  type: string;

  @Prop({ type: Number })
  unread: number;

  @Prop({ type: String })
  unreadMessage: string;

  @Prop({ type: Date })
  unreadFrom: Date;

  @Prop({ type: Types.ObjectId, ref: "Message" })
  lastMessage: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

ConversationSchema.index(
  {
    channel: 1,
    user: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      user: {
        $exists: true,
      },
    },
  }
);
