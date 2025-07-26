import { Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { ContractEvent } from "src/contract-events/schemas/contract-event.schema";

export type EmployeeDocument = HydratedDocument<Employee>;

export enum ContractStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

@Schema({ timestamps: true })
export class Employee {
  @Prop({ required: true })
  public firstName: string;

  @Prop({ required: true })
  public lastName: string;

  @Virtual({
    get: function (this: Employee) {
      return `${this.firstName} ${this.lastName}`;
    },
  })
  public fullName: string;

  @Prop({ enum: ContractStatus, default: ContractStatus.ACTIVE })
  public contractStatus: ContractStatus;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "ContractEvent" }],
    required: true,
  })
  public contractEvents: mongoose.Types.ObjectId[];

  @Prop({ required: true, unique: true })
  public cpf: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "DocumentType" }],
    default: [],
  })
  public documentTypes: mongoose.Types.ObjectId[];

  public createdAt: Date;
  public updatedAt: Date;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
