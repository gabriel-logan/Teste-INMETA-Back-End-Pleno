import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type ContractEventDocument = HydratedDocument<ContractEvent>;

export enum ContractEventType {
  HIRED = "hired",
  FIRED = "fired",
  REHIRED = "rehired",
}

@Schema({ timestamps: true })
export class ContractEvent {
  public readonly _id: Types.ObjectId;

  @Prop({ required: true, enum: ContractEventType })
  public type: ContractEventType;

  @Prop({ required: true })
  public date: Date;

  @Prop({ required: true, maxlength: 255 })
  public reason: string;

  @Prop({ required: true, maxlength: 100 })
  public employeeFullName: string;

  @Prop({ required: true, maxlength: 11 })
  public employeeCpf: string;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
}

export const ContractEventSchema = SchemaFactory.createForClass(ContractEvent);
