import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { BaseObservation } from "src/api/observation/observation/schemas/observation.schema";

export type HomeMonitoringObservationDocument = HomeMonitoringObservation &
  Document;

@Schema({ timestamps: true })
export class HomeMonitoringObservation extends BaseObservation {}

export const HomeMonitoringObservationSchema = SchemaFactory.createForClass(
  HomeMonitoringObservation
);
