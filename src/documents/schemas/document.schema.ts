import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { DocumentType } from "src/document-types/schemas/document-type.schema";
import { Employee } from "src/employees/schemas/employee.schema";

export type DocumentDocument = HydratedDocument<Document>;

export enum DocumentStatus {
  MISSING = "missing",
  AVAILABLE = "available",
}

@Schema({ timestamps: true })
export class Document {
  @Prop({ required: true, enum: DocumentStatus })
  public status: DocumentStatus;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  })
  public employee: Employee;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "DocumentType",
    required: true,
  })
  public documentType: DocumentType;

  @Prop({ type: String, default: null })
  public url: string | null;

  public createdAt: Date;
  public updatedAt: Date;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
