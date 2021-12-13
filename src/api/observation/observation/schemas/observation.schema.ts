import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { TYPE_ENUM, STATUS_ENUM } from "../observation.module";

export class BaseObservation {
  type: string;
  user: string;
  key: string;
  value: string;
  unit: string;
  status?: string;
  isCalculated?: boolean;
  name: string;
  observedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export type ObservationDocument = Observation & Document;

@Schema({ timestamps: true, discriminatorKey: "type" })
export class Observation implements BaseObservation {
  @Prop({
    type: String,
    enum: TYPE_ENUM,
    required: true,
    default: "home-monitoring",
  })
  type: string;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  user: string;

  @Prop({ type: String })
  key: string;

  @Prop({ type: String, required: true })
  value: string;

  @Prop({ type: String })
  unit: string;

  @Prop({ type: String, enum: STATUS_ENUM })
  status: string;

  @Prop({ type: Boolean, default: false })
  isCalculated: boolean;

  @Prop({ type: String })
  name: string;

  @Prop({ type: Date, required: true })
  observedAt: Date;

  @Prop({ type: Types.ObjectId, ref: "User" })
  createdBy: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  updatedBy: string;
}

export const ObservationSchema = SchemaFactory.createForClass(Observation);
