import moment from "moment";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";
import { IBaseSchema } from "src/hooks/database/schema/base.schema";
import { FileInfo, FileInfoSchema } from "src/common/schemas/file-info.schema";
import { Profile, ProfileSchema } from "./profile.schema";
import { Document, DocumentSchema } from "./document.schema";
import { TITLE_ENUM } from "../provider.module";
import { CONTRACT_ENUM } from "../provider.module";
import { CONSULTTIME_ENUM } from "../provider.module";
import {
  MediumEnabledDocument,
  MediumEnabledSchema,
} from "./medium-enabled.schema";

export type ProviderDocument = Provider & mongoose.Document;

@Schema({ timestamps: true })
export class Provider extends IBaseSchema {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, enum: TITLE_ENUM, default: "Bs" })
  title: string;

  @Prop({ type: String, unique: true })
  slug: string;

  @Prop({ type: Boolean, default: false })
  active: boolean;

  @Prop({ type: String, enum: CONTRACT_ENUM })
  contract: string;

  @Prop({ type: MediumEnabledSchema })
  mediumEnabled: MediumEnabledDocument;

  @Prop({ type: Boolean, default: false, index: true })
  published: boolean;

  @Prop({ type: [String] })
  spoken: string[];

  @Prop({ type: Number, enum: CONSULTTIME_ENUM })
  consultTime: number;

  @Prop({ type: Number, default: 30 })
  bookingDelay: number;

  @Prop({ type: Number, default: 0 })
  adminOrder: number;

  @Prop({ type: Number, min: 0, default: 0 })
  order: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: "Specialty" }] })
  specialty: string[];

  @Prop({ type: FileInfoSchema })
  avatar: FileInfo;

  @Prop({ type: Date, index: true, default: () => moment() })
  joinDate: Date;

  @Prop({ type: ProfileSchema })
  profile: Profile;

  @Prop({ type: String })
  highlight: string;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  user: string;

  @Prop({ type: DocumentSchema })
  document: Document;

  @Prop({ type: String })
  licenceNumber: string;

  @Prop({ type: String })
  identityNumber: string;

  @Prop({ type: String })
  tax: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: "Location" }] })
  location: string[];
}

export const ProviderSchema = SchemaFactory.createForClass(Provider);
