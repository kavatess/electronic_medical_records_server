import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { FileInfo, FileInfoSchema } from "src/common/schemas/file-info.schema";

export type DocumentDocument = Document & mongoose.Document;

@Schema({ _id: false, versionKey: false, timestamps: false })
export class Document {
  @Prop({ type: FileInfoSchema })
  identity1: FileInfo;

  @Prop({ type: FileInfoSchema })
  identity2: FileInfo;

  @Prop({ type: FileInfoSchema })
  license: FileInfo;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
