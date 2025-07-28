import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";

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

  @Prop({ required: true })
  public reason: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  })
  public employee: mongoose.Types.ObjectId;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
}

export const ContractEventSchema = SchemaFactory.createForClass(ContractEvent);
