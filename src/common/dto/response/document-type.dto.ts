import { ApiProperty } from "@nestjs/swagger";
import type { Types } from "mongoose";
import { DocumentTypeAllowedValues } from "src/document-types/schemas/document-type.schema";

export class DocumentTypeResponseDto {
  @ApiProperty({
    type: String,
    format: "objectId",
    description: "Unique identifier for the document type",
    example: "60c72b2f9b1e8b001c8e4d3a",
  })
  public readonly _id: Types.ObjectId;

  @ApiProperty({
    type: String,
    description: "Unique identifier for the document type",
    example: "60c72b2f9b1e8b001c8e4d3a",
  })
  public readonly id: string;

  @ApiProperty({
    enum: DocumentTypeAllowedValues,
    description: "Name of the document type",
  })
  public readonly name: DocumentTypeAllowedValues;

  @ApiProperty({
    type: Date,
    description: "Timestamp when the document type was created",
  })
  public readonly createdAt: Date;

  @ApiProperty({
    type: Date,
    description: "Timestamp when the document type was last updated",
  })
  public readonly updatedAt: Date;
}
