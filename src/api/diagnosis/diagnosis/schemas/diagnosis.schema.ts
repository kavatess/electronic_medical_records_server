import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Code, CodeSchema } from "./code.schema";
import { LOCALE_ENUM } from "../diagnosis.module";

export type DiagnosisDocument = Diagnosis & Document;

@Schema({ timestamps: true })
export class Diagnosis {
  @Prop({ type: String, required: true, unique: true, index: true })
  name: string;

  @Prop({ type: CodeSchema })
  code: Code;

  @Prop({ type: String, enum: LOCALE_ENUM, default: "vi" })
  locale: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  createdBy: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  updatedBy: string;
}

export const DiagnosisSchema = SchemaFactory.createForClass(Diagnosis);
