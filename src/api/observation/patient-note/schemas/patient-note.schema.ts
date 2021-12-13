import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { TYPE_ENUM } from "../patient-note.module";

export type PatientNoteDocument = PatientNote & Document;

@Schema({ timestamps: true })
export class PatientNote {
  @Prop({ type: String, required: true })
  patient: string;

  @Prop({ type: String, required: true })
  note: string;

  @Prop({ type: String, enum: TYPE_ENUM })
  type: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  createdBy: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  updatedBy: string;
}

export const PatientNoteSchema = SchemaFactory.createForClass(PatientNote);
