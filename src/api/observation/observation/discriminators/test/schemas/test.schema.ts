import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { BaseObservation } from "src/api/observation/observation/schemas/observation.schema";

export type TestObservationDocument = TestObservation & Document;

@Schema({ timestamps: true })
export class TestObservation extends BaseObservation {
  @Prop({ type: Types.ObjectId, ref: "Test" })
  test: string;

  @Prop({ type: Types.ObjectId, ref: "TestResult" })
  testResult: string;
}

export const TestObservationSchema =
  SchemaFactory.createForClass(TestObservation);
