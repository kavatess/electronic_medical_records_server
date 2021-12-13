import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { STATE_ENUM } from "../test-request.module";
import { URGENCY_ENUM } from "../test-request.module";

export type TestRequestDocument = TestRequest & Document;

@Schema({ timestamps: true })
export class TestRequest {
  @Prop({ type: Types.ObjectId, ref: "Provider" })
  provider: string;

  @Prop({ type: Types.ObjectId, ref: "Consultation" })
  consultation: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: "Test" }] })
  tests: string[];

  @Prop({ type: Types.ObjectId, ref: "User" })
  patient: string;

  @Prop({ type: String, enum: STATE_ENUM })
  state: string;

  @Prop({ type: String, enum: URGENCY_ENUM })
  urgency: string;

  @Prop({ type: String })
  instructions: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  createdBy: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  updatedBy: string;
}

export const TestRequestSchema = SchemaFactory.createForClass(TestRequest);
