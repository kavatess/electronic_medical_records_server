import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Name, NameSchema } from "./name.schema";
import { TYPE_ENUM } from "../medical-reference.module";

export class BaseMedicalReference {
  name: Name;
  type: string;
  value: number;
  order: number;
  createdBy: string;
  updatedBy: string;
}

export type MedicalReferenceDocument = MedicalReference & Document;

@Schema({ timestamps: true, discriminatorKey: "type" })
export class MedicalReference implements BaseMedicalReference {
  @Prop({
    type: String,
    enum: TYPE_ENUM,
    required: true,
  })
  type: string;

  @Prop({ type: NameSchema })
  name: Name;

  @Prop({ type: Number })
  value: number;

  @Prop({ type: Number })
  order: number;

  @Prop({ type: Types.ObjectId, ref: "User" })
  createdBy: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  updatedBy: string;
}

export const MedicalReferenceSchema =
  SchemaFactory.createForClass(MedicalReference);
