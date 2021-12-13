import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import {
  FacebookHomeUrl,
  FacebookHomeUrlSchema,
} from "./facebook-home-url.schema";

export type FacebookDocument = Facebook & Document;

@Schema({ _id: false, versionKey: false, timestamps: false })
export class Facebook {
  @Prop({ type: String })
  id: string;

  @Prop({ type: FacebookHomeUrlSchema })
  home_url: FacebookHomeUrl;

  @Prop({ type: String })
  access_token: string;

  @Prop({ type: String, default: "{}" })
  persistent_menu: string;

  @Prop({ type: Boolean, default: false })
  connectChannel: boolean;
}

export const FacebookSchema = SchemaFactory.createForClass(Facebook);
