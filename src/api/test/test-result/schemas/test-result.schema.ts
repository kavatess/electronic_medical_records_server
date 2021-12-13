import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type TestResultDocument = TestResult & Document;

@Schema({ timestamps: true })
export class TestResult {
  @Prop({ type: Types.ObjectId, ref: "TestRequest" })
  testRequest: string;

  @Prop({ type: Date })
  reportedAt: Date;

  @Prop({ type: Types.ObjectId, ref: "User" })
  patient: string;

  @Prop({ type: String })
  interpretation: string;

  @Prop({ type: String })
  instructions: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  createdBy: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  updatedBy: string;
}

export const TestResultSchema = SchemaFactory.createForClass(TestResult);
