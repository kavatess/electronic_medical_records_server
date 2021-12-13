import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { TYPE_ENUM } from "../favorite.module";

export type FavoriteDocument = Favorite & Document;

@Schema({ timestamps: true })
export class Favorite {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  user: string;

  @Prop({ type: Boolean, default: false })
  share: boolean;

  @Prop({ type: String, enum: TYPE_ENUM })
  type: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  value: string;

  @Prop({ type: Number })
  hit: number;

  @Prop({ type: Types.ObjectId, ref: "User" })
  createdBy: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  updatedBy: string;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
