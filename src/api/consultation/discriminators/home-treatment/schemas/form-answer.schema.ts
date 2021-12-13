import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type FormAnswerDocument = FormAnswer & Document;

@Schema({ _id: false, versionKey: false, timestamps: false })
export class FormAnswer {
  @Prop({ type: Boolean })
  isHidden: boolean;

  @Prop({ type: String })
  questionTitle: string;

  @Prop({ type: String })
  text: string;

  @Prop({ type: Boolean })
  hasScore: boolean;

  @Prop({ type: Number })
  score: number;

  @Prop({ type: Boolean })
  isCalculator: boolean;
}

export const FormAnswerSchema = SchemaFactory.createForClass(FormAnswer);
