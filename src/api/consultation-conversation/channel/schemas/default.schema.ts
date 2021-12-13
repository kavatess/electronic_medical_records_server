import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type DefaultDocument = Default & Document;

@Schema({ _id: false, versionKey: false, timestamps: false })
export class Default {
  @Prop({ type: Types.ObjectId, ref: "Corpus" })
  corpus: string;

  @Prop({ type: Number, min: 0, max: 3600, default: 10 })
  waitToRespond: number;

  @Prop({ type: Number, min: 0, max: 4320, default: 120 })
  chatSessionTimeout: number;
}

export const DefaultSchema = SchemaFactory.createForClass(Default);
