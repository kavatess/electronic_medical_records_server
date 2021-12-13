import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { BasicConsultation } from "src/api/consultation/schemas/consultation.schema";
import { ShortLinkDocument, ShortLinkSchema } from "./shortlink.schema";
import { TransferredDocument, TransferredSchema } from "./transferred.schema";
import { CancelledByDocument, CancelledBySchema } from "./cancelled-by.schema";
import { INDEPTH_MEDIUM_ENUM } from "../indepth.constant";
import { FormDocument, FormSchema } from "./form.schema";
import {
  FollowUpQuestionDocument,
  FollowUpQuestionSchema,
} from "./follow-up-question.schema";

export type IndepthDocument = Indepth & Document;

@Schema({ timestamps: true })
export class Indepth extends BasicConsultation {
  @Prop({ type: Boolean, default: false })
  noneDrug: boolean;

  @Prop({ type: Types.ObjectId, ref: "Provider", required: true })
  provider: string;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  providerUser: string;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  user: string;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  patient: string;

  @Prop({ type: String, enum: INDEPTH_MEDIUM_ENUM, default: "phone" })
  medium: string;

  @Prop({ type: Number, default: 15 })
  consultTime: number;

  @Prop({ type: ShortLinkSchema })
  shortLink: ShortLinkDocument;

  @Prop({ type: Types.ObjectId, ref: "OrderItem" })
  orderItem: string;

  @Prop({ type: Types.ObjectId, ref: "Order" })
  order: string;

  @Prop({ type: String })
  chiefComplaint: string;

  @Prop({ type: String })
  symptom: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: "Diagnosis" }] })
  diagnosis: string[];

  @Prop({ type: String })
  note: string;

  @Prop({ type: Types.ObjectId, ref: "Conversation" })
  conversation: string;

  @Prop({ type: String })
  reason: string;

  @Prop({ type: [String], default: [] })
  questions: string[];

  @Prop({ type: [String], default: [] })
  noteAudio: string[];

  @Prop({ type: TransferredSchema })
  transferred: TransferredDocument;

  @Prop({ type: CancelledBySchema })
  cancelledBy: CancelledByDocument;

  @Prop({ type: String })
  comment: string;

  @Prop({ type: FollowUpQuestionSchema })
  followUpQuestion?: FollowUpQuestionDocument;

  @Prop({ type: [FormSchema] })
  forms: FormDocument[];
}

export const IndepthSchema = SchemaFactory.createForClass(Indepth);
