import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
//import_child_schema//
//import_constant//

export type ChildDocument = Child & Document;

@Schema({ _id: false, versionKey: false, timestamps: false })
export class Child {
//Prop
}

export const ChildSchema = SchemaFactory.createForClass(Child);
