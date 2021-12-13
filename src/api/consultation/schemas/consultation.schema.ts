import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import {
  CLOSED_STATES,
  MEDIUM_ENUM,
  STATE_ENUM,
  TYPE_ENUM,
} from "../consultation.constant";
import { CancelledByDocument, CancelledBySchema } from "./cancelled-by.schema";
import {
  FollowUpQuestionDocument,
  FollowUpQuestionSchema,
} from "./follow-up-question.schema";
import { FormDocument, FormSchema } from "./form.schema";
import { MetadataDocument, MetadataSchema } from "./metadata.schema";
import { ShortLinkDocument, ShortLinkSchema } from "./shortlink.schema";
import { TransferredDocument, TransferredSchema } from "./transferred.schema";

export class BasicConsultation {
  type: string;
  test: boolean;
  tags: string[];
  state: string;
  closedAt: Date;
  metaString: string;
  metadata: MetadataDocument;
  createdBy: string;
  updatedBy: string;
}

export type ConsultationDocument = Consultation & Document;

@Schema({
  timestamps: true,
  discriminatorKey: "type",
  toObject: { virtuals: true },
})
export class Consultation implements BasicConsultation {
  @Prop({
    type: String,
    enum: TYPE_ENUM,
    default: "indepth",
    required: true,
  })
  type: string;

  @Prop({ type: Boolean, default: false })
  test: boolean;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ type: String, enum: STATE_ENUM, default: "WAITING", required: true })
  state: string;

  @Prop({ type: Date })
  closedAt: Date;

  @Prop({ type: String, default: "{}" })
  metaString: string;

  @Prop({ type: MetadataSchema, default: {} })
  metadata: MetadataDocument;

  @Prop({ type: Boolean })
  noneDrug: boolean;

  @Prop({ type: Types.ObjectId, ref: "Provider" })
  provider: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  providerUser: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  user: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  patient: string;

  @Prop({ type: String, enum: MEDIUM_ENUM, default: "phone" })
  medium: string;

  @Prop({ type: Number })
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

  @Prop({ type: [String] })
  questions: string[];

  @Prop({ type: [String] })
  noteAudio: string[];

  @Prop({ type: TransferredSchema })
  transferred: TransferredDocument;

  @Prop({ type: CancelledBySchema })
  cancelledBy: CancelledByDocument;

  @Prop({ type: String })
  comment: string;

  @Prop({ type: Date })
  treatmentEndedAt: Date;

  @Prop({ type: FollowUpQuestionSchema })
  followUpQuestion: FollowUpQuestionDocument;

  @Prop({ type: [FormSchema] })
  forms: FormDocument[];

  @Prop({ type: Types.ObjectId, ref: "User" })
  createdBy: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  updatedBy: string;
}

export const ConsultationSchema = SchemaFactory.createForClass(Consultation);

ConsultationSchema.virtual("isClosed").get(function () {
  return CLOSED_STATES.includes(this.get("state"));
});

ConsultationSchema.post("init", function (doc: ConsultationDocument) {
  this["originalDoc"] = doc ? doc.toObject() : {};
})
  .pre("save", function (next) {
    this["wasNew"] = this.isNew;
    this.modifiedPaths().forEach((path) => {
      const startCasePath = path.charAt(0).toUpperCase() + path.slice(1);
      this[`was${startCasePath}Modified`] = true;
    });
    this["changedPaths"] = this.modifiedPaths();
    next();
  })
  .pre("save", function (next) {
    if (this.isModified("state") && CLOSED_STATES.includes(this.get("state"))) {
      this.set("closedAt", new Date());
    }
    next();
  });
