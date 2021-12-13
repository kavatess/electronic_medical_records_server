import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Code, CodeSchema } from "./code.schema";
import { TYPE_ENUM } from "../test.module";
import { SPECIMEN_ENUM } from "../test.module";
import { LOCALE_ENUM } from "../test.module";

export type TestDocument = Test & Document;

@Schema({ timestamps: true })
export class Test {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, enum: TYPE_ENUM })
  type: string;

  @Prop({ type: String, enum: SPECIMEN_ENUM })
  specimen: string;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ type: CodeSchema })
  code: Code;

  @Prop({ type: String })
  abbreviation: string;

  @Prop({ type: String, enum: LOCALE_ENUM, default: "vi" })
  locale: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  createdBy: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  updatedBy: string;
}

export const TestSchema = SchemaFactory.createForClass(Test);
