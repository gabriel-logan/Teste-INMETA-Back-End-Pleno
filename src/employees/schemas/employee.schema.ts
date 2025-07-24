import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type EmployeeDocument = HydratedDocument<Employee>;

@Schema({ timestamps: true })
export class Employee {
  @Prop({ required: true })
  public name: string;

  public createdAt: Date;
  public updatedAt: Date;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
