import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false, versionKey: false })
export class ImageMeta {
  @Prop({ type: String }) title: string;
  @Prop({ type: String }) description: string;
  @Prop({ type: String }) image: string;
  @Prop(
    raw({
      title: { type: String },
      description: { type: String },
      image: { type: String },
    })
  )
  og: { title: string; description: string; image: string };
}

export const ImageMetaSchema = SchemaFactory.createForClass(ImageMeta);
