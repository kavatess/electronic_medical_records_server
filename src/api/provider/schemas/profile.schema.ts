import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import moment from "moment";

export type ProfileDocument = Profile & Document;

@Schema({ _id: false, versionKey: false, timestamps: false })
export class Profile {
  @Prop({ type: String })
  education: string;

  @Prop({ type: String })
  experience: string;

  @Prop({ type: String })
  portrait: string;

  @Prop({ type: String })
  tagLine: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: "Diagnosis" }] })
  diagnosis: string[];

  @Prop({ type: String })
  experiencesDescription: string;

  @Prop({ type: Date, default: () => moment().subtract(5, "y") })
  startWork: Date;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
