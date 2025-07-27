import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type DocumentTypeDocument = HydratedDocument<DocumentType>;

export enum DocumentTypeAllowedValues {
  CPF = "CPF",
  CNPJ = "CNPJ",
  CTPS = "CTPS",
  RG = "RG",
  CNH = "CNH",
  PASSAPORTE = "PASSAPORTE",
  CRM = "CRM",
  SUS = "SUS",
}

@Schema({ timestamps: true })
export class DocumentType {
  public readonly _id: Types.ObjectId;

  @Prop({ required: true, unique: true, enum: DocumentTypeAllowedValues })
  public name: DocumentTypeAllowedValues;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
}

export const DocumentTypeSchema = SchemaFactory.createForClass(DocumentType);
