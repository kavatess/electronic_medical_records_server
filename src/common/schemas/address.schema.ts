import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false, versionKey: false })
export class Address {
  @Prop({ type: String }) number: string;
  @Prop({ type: String }) name: string;
  @Prop({ type: String }) street1: string;
  @Prop({ type: String }) street2: string;
  @Prop({ type: String }) street3: string;
  @Prop({ type: String }) suburb: string;
  @Prop({ type: String }) state: string;
  @Prop({ type: String }) postcode: string;
  @Prop({ type: String }) country: string;
  @Prop({ type: String }) geo: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
