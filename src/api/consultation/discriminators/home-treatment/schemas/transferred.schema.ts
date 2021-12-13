import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type TransferredDocument = Transferred & Document;

@Schema({ _id: false, versionKey: false, timestamps: false })
export class Transferred {
  @Prop({ type: Boolean, default: false })
  isTransfer: boolean;

  @Prop({ type: Boolean, default: false })
  isOwner: boolean;

  @Prop({ type: Types.ObjectId, ref: "Consultation" })
  by: string;
}

export const TransferredSchema = SchemaFactory.createForClass(Transferred);
