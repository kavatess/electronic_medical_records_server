import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false, versionKey: false })
export class FileInfo {
  @Prop({ type: Number }) size: number;
  @Prop({ type: String }) mimetype: string;
  @Prop({ type: String }) path: string;
  @Prop({ type: String }) fileName: string;
  @Prop({ type: String }) bucket: string;
  @Prop({ type: String }) etag: string;
  @Prop({
    type: String,
    required: true,
  })
  url: string;
}

export const FileInfoSchema = SchemaFactory.createForClass(FileInfo);
