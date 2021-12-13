import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { BaseMedicalReference } from "src/api/medical-reference/schemas/medical-reference.schema";

export type OtherReferenceDocument = OtherReference & Document;

@Schema({ timestamps: true })
export class OtherReference extends BaseMedicalReference {}

export const OtherReferenceSchema =
  SchemaFactory.createForClass(OtherReference);
