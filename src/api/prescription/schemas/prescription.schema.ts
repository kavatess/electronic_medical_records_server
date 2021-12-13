import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type PrescriptionDocument = Prescription & Document;

@Schema({ timestamps: true })
export class Prescription {
  @Prop({ type: Types.ObjectId, ref: "Consultation" })
  consultation: string;

  @Prop({ type: Types.ObjectId, ref: "Drug", required: true })
  drug: string;

  @Prop({ type: Types.ObjectId, ref: "MedicalReference" })
  route: string;

  @Prop({ type: Number })
  take: number;

  @Prop({ type: String })
  unit: string;

  @Prop({ type: Number })
  total: number;

  @Prop({ type: Number })
  duration: number;

  @Prop({ type: Types.ObjectId, ref: "MedicalReference" })
  frequency: string;

  @Prop({ type: String })
  note: string;

  @Prop({ type: Boolean, default: false })
  followDirection: boolean;

  @Prop({ type: Types.ObjectId, ref: "User" })
  createdBy: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  updatedBy: string;
}

export const PrescriptionSchema = SchemaFactory.createForClass(Prescription);
