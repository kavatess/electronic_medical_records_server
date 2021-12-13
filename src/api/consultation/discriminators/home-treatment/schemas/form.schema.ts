import mongoose from "mongoose";
import { Document } from "mongoose";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { FormAnswerDocument, FormAnswerSchema } from "./form-answer.schema";

export type FormDocument = Form & Document;

@Schema({ _id: false, versionKey: false, timestamps: false })
export class Form {
  @Prop({ type: String, required: true })
  id: string;

  @Prop({ type: String })
  slug: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  imageUrl: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Date })
  submittedAt: Date;

  @Prop({ type: [FormAnswerSchema] })
  answers: FormAnswerDocument[];

  @Prop({ type: mongoose.Schema.Types.Mixed })
  hiddenFields: any;

  @Prop({ type: Number })
  totalScore: number;
}

export const FormSchema = SchemaFactory.createForClass(Form);
