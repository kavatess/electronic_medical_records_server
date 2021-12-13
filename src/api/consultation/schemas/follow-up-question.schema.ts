import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import {
  FOLLOW_UP_QUESTION_STATE_ENUM,
  FOLLOW_UP_QUESTION_TYPE_ENUM,
} from "../consultation.constant";

export type FollowUpQuestionDocument = FollowUpQuestion & Document;

@Schema({ _id: false, versionKey: false, timestamps: true })
export class FollowUpQuestion {
  @Prop({ type: String, enum: FOLLOW_UP_QUESTION_TYPE_ENUM })
  type: string;

  @Prop({ type: String })
  question: string;

  @Prop({ type: String })
  answer: string;

  @Prop({
    type: String,
    enum: FOLLOW_UP_QUESTION_STATE_ENUM,
    default: "waiting",
  })
  state: string;
}

export const FollowUpQuestionSchema =
  SchemaFactory.createForClass(FollowUpQuestion);
