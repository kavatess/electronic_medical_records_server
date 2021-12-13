import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false, versionKey: false })
export class RatingInfo {
  @Prop({ type: Number }) average: number;
  @Prop({ type: Number }) voter: number;
}

export const RatingInfoSchema = SchemaFactory.createForClass(RatingInfo);
