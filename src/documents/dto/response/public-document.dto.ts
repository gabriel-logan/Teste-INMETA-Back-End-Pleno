import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";
import { DocumentType } from "src/document-types/schemas/document-type.schema";
import {
  Document,
  DocumentStatus,
} from "src/documents/schemas/document.schema";
import { Employee } from "src/employees/schemas/employee.schema";

export class PublicDocumentResponseDto implements Document {
  @ApiProperty({
    type: String,
    format: "ObjectId",
    description: "Unique identifier for the document",
    example: "60c72b2f9b1e8c001c8f8e1d",
  })
  public id: Types.ObjectId;

  @ApiProperty({
    type: String,
    format: "ObjectId",
    description:
      "Unique identifier for the employee associated with the document",
    example: "60c72b2f9b1e8c001c8f8e1e",
  })
  public employee: Employee;

  @ApiProperty({
    type: DocumentType,
    description: "The type of the document",
    example: {
      _id: "688205905a14025cdfb57ae5",
      name: "CPF",
      createdAt: "2025-07-24T10:06:08.724Z",
      updatedAt: "2025-07-24T10:06:08.724Z",
      __v: 0,
    },
  })
  public documentType: DocumentType;

  @ApiProperty({
    type: DocumentStatus,
    description: "The status of the document",
    example: DocumentStatus.MISSING,
    enum: DocumentStatus,
    enumName: "DocumentStatus",
  })
  public status: DocumentStatus;

  @ApiProperty({
    type: String,
    description: "The URL of the document",
    example: "https://example.com/document.pdf",
    nullable: true,
  })
  public documentUrl: string | null;

  @ApiProperty({
    type: Date,
    description: "The date and time when the employee was created",
    example: "2021-06-14T10:00:00Z",
  })
  public createdAt: Date;

  @ApiProperty({
    type: Date,
    description: "The date and time when the employee was last updated",
    example: "2021-06-14T10:00:00Z",
  })
  public updatedAt: Date;
}
