import { ApiProperty } from "@nestjs/swagger";
import type { Types } from "mongoose";
import { DocumentStatus } from "src/documents/schemas/document.schema";

import { DocumentTypeResponseDto } from "./document-type.dto";
import { EmployeeBaseResponseDto } from "./employee.dto";

export class DocumentBaseResponseDto {
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
    enum: DocumentStatus,
    description: "The status of the document",
  })
  public readonly status: DocumentStatus;

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

export class DocumentFullResponseDto extends DocumentBaseResponseDto {
  @ApiProperty({
    type: EmployeeBaseResponseDto,
    description: "The employee associated with the document",
  })
  public readonly employee: EmployeeBaseResponseDto;

  @ApiProperty({
    type: DocumentTypeResponseDto,
    description: "The type of the document",
  })
  public readonly documentType: DocumentTypeResponseDto;
}

export class DocumentWithEmployeeResponseDto extends DocumentBaseResponseDto {
  @ApiProperty({
    type: EmployeeBaseResponseDto,
    description: "The employee associated with the document",
  })
  public readonly employee: EmployeeBaseResponseDto;
}

export class DocumentWithDocumentTypeResponseDto extends DocumentBaseResponseDto {
  @ApiProperty({
    type: DocumentTypeResponseDto,
    description: "The type of the document",
  })
  public readonly documentType: DocumentTypeResponseDto;
}
