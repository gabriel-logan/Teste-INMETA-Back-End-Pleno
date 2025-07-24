import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type DocumentsTypeDocument = HydratedDocument<DocumentsType>;

@Schema({ timestamps: true })
export class DocumentsType {
  @Prop({ required: true })
  public name: string;

  public createdAt: Date;
  public updatedAt: Date;
}

export const DocumentsTypeSchema = SchemaFactory.createForClass(DocumentsType);
