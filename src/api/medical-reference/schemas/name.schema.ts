import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type NameDocument = Name & Document;

@Schema({ _id: false, versionKey: false, timestamps: false })
export class Name {
  @Prop({ type: String })
  en: string;

  @Prop({ type: String })
  vi: string;
}

export const NameSchema = SchemaFactory.createForClass(Name);
