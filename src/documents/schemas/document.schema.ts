import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { DocumentType } from "src/document-types/schemas/document-type.schema";

export type DocumentDocument = HydratedDocument<Document>;

export enum DocumentStatus {
  MISSING = "missing",
  AVAILABLE = "available",
}

@Schema({ timestamps: true })
export class Document {
  @Prop({ required: true })
  public status: DocumentStatus;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: DocumentType.name,
    required: true,
  })
  public documentType: DocumentType;

  @Prop({ required: false })
  public url?: string;

  public createdAt: Date;
  public updatedAt: Date;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
