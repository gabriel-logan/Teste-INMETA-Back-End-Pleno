import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ContractEventDocument = HydratedDocument<ContractEvent>;

export enum ContractEventType {
  HIRED = "hired",
  FIRED = "fired",
  REHIRED = "rehired",
}

@Schema({ timestamps: true })
export class ContractEvent {
  @Prop({ required: true, enum: ContractEventType })
  public type: ContractEventType;

  @Prop({ required: true })
  public date: Date;

  @Prop({ required: true })
  public reason: string;

  public createdAt: Date;
  public updatedAt: Date;
}

export const ContractEventSchema = SchemaFactory.createForClass(ContractEvent);
