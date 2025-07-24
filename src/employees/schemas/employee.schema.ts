import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Document } from "src/documents/schemas/document.schema";

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

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Document.name }],
  })
  public documents: Document[];

  public createdAt: Date;
  public updatedAt: Date;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
