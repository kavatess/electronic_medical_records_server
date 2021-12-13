import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CodeDocument = Code & Document;

@Schema({ _id: false, versionKey: false, timestamps: false })
export class Code {
  @Prop({ type: String })
  icd10: string;
}

export const CodeSchema = SchemaFactory.createForClass(Code);
