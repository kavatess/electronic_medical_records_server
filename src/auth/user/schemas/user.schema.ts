import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Date, required: true })
  dob: Date;

  @Prop({ type: String, enum: ["M", "F"], required: true })
  gender: string;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: String })
  search: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  username: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: String, default: "84" })
  countryCode: string;

  @Prop({ type: Types.ObjectId, ref: "Provider" })
  provider: string;

  @Prop({ type: Boolean, default: false })
  isAdmin: boolean;

  @Prop({ type: Boolean, default: false })
  createAccount: boolean;

  @Prop({ type: Types.ObjectId, ref: "User", required: false })
  createdBy: string;

  @Prop({ type: Types.ObjectId, ref: "User", required: false })
  updatedBy: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
