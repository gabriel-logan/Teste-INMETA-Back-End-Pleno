import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type DocumentTypeDocument = HydratedDocument<DocumentType>;

@Schema({ timestamps: true })
export class DocumentType {
  @Prop({ required: true })
  public name: string;

  public createdAt: Date;
  public updatedAt: Date;
}

export const DocumentTypeSchema = SchemaFactory.createForClass(DocumentType);
