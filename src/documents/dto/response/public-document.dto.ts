import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";
import { DocumentType } from "src/document-types/schemas/document-type.schema";
import { DocumentStatus } from "src/documents/schemas/document.schema";
import { Employee } from "src/employees/schemas/employee.schema";

export class PublicDocumentResponseDto {
  @ApiProperty({
    type: String,
    format: "ObjectId",
    description: "Unique identifier for the document",
    example: "60c72b2f9b1e8c001c8f8e1d",
  })
  public readonly id: Types.ObjectId;

  @ApiProperty()
  public readonly employee: Employee;

  @ApiProperty()
  public readonly documentType: DocumentType;

  @ApiProperty({
    type: DocumentStatus,
    description: "The status of the document",
    example: DocumentStatus.MISSING,
    enum: DocumentStatus,
    enumName: "DocumentStatus",
  })
  public readonly status: DocumentStatus;

  @ApiProperty({
    type: String,
    description: "The URL of the document",
    example: "https://example.com/document.pdf",
    nullable: true,
  })
  public readonly documentUrl: string | null;

  @ApiProperty({
    type: Date,
    description: "The date and time when the employee was created",
    example: "2021-06-14T10:00:00Z",
  })
  public readonly createdAt: Date;

  @ApiProperty({
    type: Date,
    description: "The date and time when the employee was last updated",
    example: "2021-06-14T10:00:00Z",
  })
  public readonly updatedAt: Date;
}
