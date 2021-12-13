import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type MetadataDocument = Metadata & Document;

@Schema({ _id: false, versionKey: false, timestamps: false })
export class Metadata {
  @Prop({ type: Number })
  minuteAvg?: number;

  @Prop({ type: Number })
  yearsofEXP?: number;

  @Prop({ type: String })
  privateDoctorReply?: string;

  @Prop({ type: Number })
  ratingGood?: number;

  @Prop({ type: Boolean })
  registerQuickcall?: boolean;
}

export const MetadataSchema = SchemaFactory.createForClass(Metadata);
