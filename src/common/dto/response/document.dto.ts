import { ApiProperty } from "@nestjs/swagger";
import type { Types } from "mongoose";
import { DocumentStatus } from "src/documents/schemas/document.schema";

import { DocumentTypeResponseDto } from "./document-type.dto";
import { EmployeeFullSecureResponseDto } from "./employee.dto";

export class DocumentFullResponseDto {
  @ApiProperty({
    type: String,
    format: "objectId",
    description: "The unique identifier of the document",
  })
  public readonly _id: Types.ObjectId;

  @ApiProperty({
    type: String,
    description: "The unique identifier of the document",
  })
  public readonly id: string;

  @ApiProperty({
    type: String,
    description: "The status of the document",
    enum: DocumentStatus,
  })
  public readonly status: DocumentStatus;

  @ApiProperty({
    type: EmployeeFullSecureResponseDto,
    description: "The employee associated with the document",
  })
  public readonly employee: EmployeeFullSecureResponseDto;

  @ApiProperty({
    type: DocumentTypeResponseDto,
    description: "The type of the document",
  })
  public readonly documentType: DocumentTypeResponseDto;

  @ApiProperty({
    type: String,
    description: "The URL of the document",
    nullable: true,
  })
  public readonly documentUrl: string | null;

  @ApiProperty({
    type: Date,
    description: "The timestamp when the document was created",
  })
  public readonly createdAt: Date;

  @ApiProperty({
    type: Date,
    description: "The timestamp when the document was last updated",
  })
  public readonly updatedAt: Date;
}
