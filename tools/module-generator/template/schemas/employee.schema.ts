import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
//import_child_schema//
//import_constant//

export type EmployeeDocument = Employee & Document;

@Schema({ timestamps: true })
export class Employee {
//Prop

    @Prop({ type: Types.ObjectId, ref: "User" })
    createdBy: string;

    @Prop({ type: Types.ObjectId, ref: "User" })
    updatedBy: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
