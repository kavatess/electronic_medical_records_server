import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { INDEPTH_CANCELLED_ROLE_ENUM } from "../indepth.constant";

export type CancelledByDocument = CancelledBy & Document;

@Schema({ _id: false, versionKey: false, timestamps: false })
export class CancelledBy {
  @Prop({ type: Types.ObjectId, ref: "User" })
  user: string;

  @Prop({ type: String, enum: INDEPTH_CANCELLED_ROLE_ENUM })
  role: string;

  @Prop({ type: String })
  reason: string;

  @Prop({ type: String })
  comment: string;
}

export const CancelledBySchema = SchemaFactory.createForClass(CancelledBy);
