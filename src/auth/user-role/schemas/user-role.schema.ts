import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Roles } from "src/common/constants";

export type UserRoleDocument = UserRole & Document;
@Schema({ timestamps: true })
export class UserRole {
  @Prop({
    type: Types.ObjectId,
    ref: "User",
    required: true,
    autopopulate: true,
  })
  user: string;

  @Prop({ type: String, required: true, enum: Roles })
  role: string;

  @Prop({ type: Types.ObjectId, ref: "User", required: false })
  createdBy: string;

  @Prop({ type: Types.ObjectId, ref: "User", required: false })
  updatedBy: string;
}
export const UserRoleSchema = SchemaFactory.createForClass(UserRole);
