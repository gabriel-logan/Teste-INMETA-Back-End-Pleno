import { Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { hash } from "bcrypt";
import mongoose, { HydratedDocument } from "mongoose";
import { ContractEvent } from "src/contract-events/schemas/contract-event.schema";
import { DocumentType } from "src/document-types/schemas/document-type.schema";

export type EmployeeDocument = HydratedDocument<Employee>;

export enum ContractStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum EmployeeRole {
  MANAGER = "manager",
  ADMIN = "admin",
  COMMON = "common",
}

@Schema({ timestamps: true })
export class Employee {
  public readonly _id: mongoose.Types.ObjectId;

  @Prop({ required: true, maxlength: 100 })
  public firstName: string;

  @Prop({ required: true, maxlength: 100 })
  public lastName: string;

  @Virtual({
    get(this: Employee) {
      return `${this.firstName} ${this.lastName}`;
    },
  })
  public fullName: string;

  @Prop({ required: true, unique: true, maxlength: 100 })
  public username: string;

  @Prop({ required: true, maxlength: 255 })
  public password: string;

  @Prop({ enum: ContractStatus, default: ContractStatus.ACTIVE })
  public contractStatus: ContractStatus;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "ContractEvent" }],
    required: true,
  })
  public contractEvents: ContractEvent[];

  @Prop({ required: true, unique: true, maxlength: 11 })
  public cpf: string;

  @Prop({ enum: EmployeeRole, default: EmployeeRole.COMMON })
  public role: EmployeeRole;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "DocumentType" }],
    default: [],
  })
  public documentTypes: DocumentType[];

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);

EmployeeSchema.pre<EmployeeDocument>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await hash(this.password, 8);

  next();
});
