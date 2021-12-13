import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { FileInfo, FileInfoSchema } from "src/common/schemas/file-info.schema";
import { ROLE_ENUM } from "../conversation-user.module";
import { CHATPOLICY_ENUM } from "../conversation-user.module";
import { STATE_ENUM } from "../conversation-user.module";

export type ConversationUserDocument = ConversationUser & Document;

@Schema({ timestamps: true })
export class ConversationUser {
  @Prop({ type: String })
  name: string;

  @Prop({ type: FileInfoSchema })
  avatar: FileInfo;

  @Prop({ type: Types.ObjectId, ref: "Conversation", required: true })
  conversation: string;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  user: string;

  @Prop({ type: String, enum: ROLE_ENUM, default: "guest", required: true })
  role: string;

  @Prop({ type: String, enum: CHATPOLICY_ENUM, default: "allowed" })
  chatPolicy: string;

  @Prop({ type: String, enum: STATE_ENUM, default: "active" })
  state: string;

  @Prop({ type: String })
  search: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  createdBy: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  updatedBy: string;
}

export const ConversationUserSchema =
  SchemaFactory.createForClass(ConversationUser);

ConversationUserSchema.index(
  {
    conversation: 1,
    user: 1,
    role: 1,
  },
  {
    unique: true,
  }
);
