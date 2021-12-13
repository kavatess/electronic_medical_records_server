import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { BaseMedicalReference } from "src/api/medical-reference/schemas/medical-reference.schema";

export type RouteOfAdministrationReferenceDocument =
  RouteOfAdministrationReference & Document;

@Schema({ timestamps: true })
export class RouteOfAdministrationReference extends BaseMedicalReference {}

export const RouteOfAdministrationReferenceSchema =
  SchemaFactory.createForClass(RouteOfAdministrationReference);
