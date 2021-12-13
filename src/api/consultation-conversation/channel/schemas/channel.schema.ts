import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Default, DefaultSchema } from "./default.schema";
import { Facebook, FacebookSchema } from "./facebook.schema";
import { PLATFORM_ENUM } from "../channel.module";

export type ChannelDocument = Channel & Document;

@Schema({ timestamps: true })
export class Channel {
  @Prop({ type: String })
  name: string;

  @Prop({
    type: String,
    enum: PLATFORM_ENUM,
    default: "facebook",
    required: true,
  })
  platform: string;

  @Prop({ type: Types.ObjectId, ref: "Provider" })
  provider: string;

  @Prop({ type: Number, default: 0 })
  unread: number;

  @Prop({ type: String })
  picture: string;

  @Prop({ type: Boolean, default: false })
  bot: boolean;

  @Prop({ type: DefaultSchema })
  default: Default;

  @Prop({ type: FacebookSchema })
  facebook: Facebook;

  @Prop({ type: Types.ObjectId, ref: "User" })
  createdBy: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  updatedBy: string;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);

ChannelSchema.index(
  {
    "facebook.id": 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      "facebook.id": {
        $exists: true,
      },
    },
  }
);

ChannelSchema.index({
  platform: 1,
});
