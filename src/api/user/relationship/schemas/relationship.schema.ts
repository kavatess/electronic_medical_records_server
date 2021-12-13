import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { RELATIONSHIP_ENUM } from "../relationship.module";

export type RelationshipDocument = Relationship & Document;

@Schema({ timestamps: true })
export class Relationship {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  user: string;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  related: string;

  @Prop({ type: String, enum: RELATIONSHIP_ENUM, required: true })
  relationship: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  createdBy: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  updatedBy: string;
}

export const RelationshipSchema = SchemaFactory.createForClass(Relationship);
