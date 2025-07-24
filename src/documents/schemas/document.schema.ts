import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { DocumentsType } from "src/documents-types/schemas/documents-type.schema";

export type DocumentDocument = HydratedDocument<Document>;

export enum DocumentStatus {
  MISSING = "missing",
  PUBLISHED = "published",
  ARCHIVED = "archived",
  DELETED = "deleted",
}

@Schema({ timestamps: true })
export class Document {
  @Prop({ required: true })
  public name: string;

  @Prop({ required: true })
  public status: DocumentStatus;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: DocumentsType.name })
  public documentsType: DocumentsType;

  public createdAt: Date;
  public updatedAt: Date;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
