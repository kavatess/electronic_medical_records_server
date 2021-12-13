import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type PrescriptionAutoFillDocument = PrescriptionAutoFill & Document;

@Schema({ timestamps: true })
export class PrescriptionAutoFill {
  @Prop({ type: Types.ObjectId, ref: "Provider", required: true })
  provider: string;

  @Prop({ type: Types.ObjectId, ref: "Drug", required: true })
  drug: string;

  @Prop({ type: Types.ObjectId, ref: "Prescription", required: true })
  prescription: string;

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

  @Prop({ type: Types.ObjectId, ref: "User" })
  createdBy: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  updatedBy: string;
}

export const PrescriptionAutoFillSchema =
  SchemaFactory.createForClass(PrescriptionAutoFill);
