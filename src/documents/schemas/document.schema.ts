import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type DocumentDocument = HydratedDocument<Document>;

@Schema({ timestamps: true })
export class Document {
  @Prop({ required: true })
  public name: string;

  public createdAt: Date;
  public updatedAt: Date;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
