import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false, versionKey: false })
export class Period {
  @Prop({ type: Date }) from: Date;
  @Prop({ type: Date }) to: Date;
}

export const PeriodSchema = SchemaFactory.createForClass(Period);
