import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { STATE_ENUM } from "../drug.constant";

export type DrugDocument = Drug & Document;

@Schema({ timestamps: true })
export class Drug {
  @Prop({ type: String, index: true, unique: true })
  name: string;

  @Prop({ type: String, enum: STATE_ENUM })
  state: string;

  @Prop({ type: String })
  route: string;

  @Prop({ type: String })
  strength: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  createdBy: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  updatedBy: string;
}

export const DrugSchema = SchemaFactory.createForClass(Drug);
