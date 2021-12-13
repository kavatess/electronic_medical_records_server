import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { WEBVIEW_HEIGHT_RATIO_ENUM } from "../channel.module";
import { WEBVIEW_SHARE_BUTTON_ENUM } from "../channel.module";

export type FacebookHomeUrlSchemaDocument = FacebookHomeUrl & Document;

@Schema({ _id: false, versionKey: false, timestamps: false })
export class FacebookHomeUrl {
  @Prop({ type: String, default: "https://fv.khamtuxa.vn" })
  url: string;

  @Prop({ type: String, enum: WEBVIEW_HEIGHT_RATIO_ENUM, default: "tall" })
  webview_height_ratio: string;

  @Prop({ type: String, enum: WEBVIEW_SHARE_BUTTON_ENUM, default: "show" })
  webview_share_button: string;

  @Prop({ type: Boolean, default: true })
  in_test: boolean;
}

export const FacebookHomeUrlSchema =
  SchemaFactory.createForClass(FacebookHomeUrl);
