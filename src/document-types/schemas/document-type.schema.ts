import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type DocumentTypeDocument = HydratedDocument<DocumentType>;

export enum DocumentTypeAllowedValues {
  CPF = "CPF",
  CNPJ = "CNPJ",
  CTPS = "CTPS",
  RG = "RG",
  CNH = "CNH",
}

@Schema({ timestamps: true })
export class DocumentType {
  @Prop({ required: true, unique: true, enum: DocumentTypeAllowedValues })
  public name: DocumentTypeAllowedValues;

  public createdAt: Date;
  public updatedAt: Date;
}

export const DocumentTypeSchema = SchemaFactory.createForClass(DocumentType);
