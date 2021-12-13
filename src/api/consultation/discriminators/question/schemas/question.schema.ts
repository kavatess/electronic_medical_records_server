import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ShortLinkSchema, ShortLinkDocument } from "./shortlink.schema";
import { TransferredDocument, TransferredSchema } from "./transferred.schema";
import { CancelledByDocument, CancelledBySchema } from "./cancelled-by.schema";
import { BasicConsultation } from "src/api/consultation/schemas/consultation.schema";
import { QUESTION_MEDIUM_ENUM } from "../question.constant";

export type QuestionDocument = Question & Document;

@Schema({ timestamps: true })
export class Question extends BasicConsultation {
  @Prop({ type: Types.ObjectId, ref: "Provider", required: true })
  provider: string;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  providerUser: string;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  user: string;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  patient: string;

  @Prop({ type: String, enum: QUESTION_MEDIUM_ENUM, default: "none" })
  medium: string;

  @Prop({ type: ShortLinkSchema })
  shortLink: ShortLinkDocument;

  @Prop({ type: Types.ObjectId, ref: "OrderItem" })
  orderItem: string;

  @Prop({ type: Types.ObjectId, ref: "Order" })
  order: string;

  @Prop({ type: String })
  chiefComplaint: string;

  @Prop({ type: String })
  note: string;

  @Prop({ type: Types.ObjectId, ref: "Conversation" })
  conversation: string;

  @Prop({ type: String })
  reason: string;

  @Prop({ type: [String], default: [] })
  questions: string[];

  @Prop({ type: TransferredSchema })
  transferred: TransferredDocument;

  @Prop({ type: CancelledBySchema })
  cancelledBy: CancelledByDocument;

  @Prop({ type: String })
  comment: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
