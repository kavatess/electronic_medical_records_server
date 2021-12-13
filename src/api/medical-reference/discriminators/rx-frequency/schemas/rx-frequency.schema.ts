import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { BaseMedicalReference } from "src/api/medical-reference/schemas/medical-reference.schema";

export type RxFrequencyReferenceDocument = RxFrequencyReference & Document;

@Schema({ timestamps: true })
export class RxFrequencyReference extends BaseMedicalReference {}

export const RxFrequencyReferenceSchema =
  SchemaFactory.createForClass(RxFrequencyReference);
