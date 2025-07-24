import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type EmployeeDocument = HydratedDocument<Employee>;

export enum ContractStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

@Schema({ timestamps: true })
export class Employee {
  @Prop({ required: true })
  public name: string;

  @Prop({ default: ContractStatus.ACTIVE })
  public contractStatus: ContractStatus;

  @Prop({ required: true, unique: true })
  public cpf: string;

  public createdAt: Date;
  public updatedAt: Date;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
