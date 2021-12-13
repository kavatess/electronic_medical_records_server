import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { BaseMedicalReference } from "src/api/medical-reference/schemas/medical-reference.schema";

export type ObservationReferenceDocument = ObservationReference & Document;

@Schema({ timestamps: true })
export class ObservationReference extends BaseMedicalReference {}

export const ObservationReferenceSchema =
  SchemaFactory.createForClass(ObservationReference);
