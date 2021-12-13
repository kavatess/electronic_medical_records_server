import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ShortLinkDocument = ShortLink & Document;

@Schema({ _id: false, versionKey: false, timestamps: false })
export class ShortLink {
  @Prop({ type: String })
  provider: string;

  @Prop({ type: String })
  patient: string;
}

export const ShortLinkSchema = SchemaFactory.createForClass(ShortLink);
