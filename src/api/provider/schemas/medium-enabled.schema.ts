import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type MediumEnabledDocument = MediumEnabled & Document;

@Schema({ _id: false, versionKey: false, timestamps: false })
export class MediumEnabled {
  @Prop({ type: Boolean })
  chat: string;

  @Prop({ type: Boolean })
  phone: string;

  @Prop({ type: Boolean })
  video: string;

  @Prop({ type: Boolean })
  ondemand: string;
}

export const MediumEnabledSchema = SchemaFactory.createForClass(MediumEnabled);
