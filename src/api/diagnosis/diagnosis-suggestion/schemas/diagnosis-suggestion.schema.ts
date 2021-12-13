import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type DiagnosisSuggestionDocument = DiagnosisSuggestion & Document;

@Schema({ timestamps: true })
export class DiagnosisSuggestion {
  @Prop({ type: Types.ObjectId, ref: "User" })
  user: string;

  @Prop({ type: Types.ObjectId, ref: "Diagnosis" })
  diagnosis: string;

  @Prop({ type: Types.ObjectId, ref: "Consultation" })
  consultation: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  createdBy: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  updatedBy: string;
}

export const DiagnosisSuggestionSchema =
  SchemaFactory.createForClass(DiagnosisSuggestion);
