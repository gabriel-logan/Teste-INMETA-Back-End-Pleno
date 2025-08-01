import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { DocumentStatus } from "src/documents/schemas/document.schema";

export class UpdateDocumentRequestDto {
  @ApiProperty({
    enum: DocumentStatus,
    description: "The status of the document",
    example: DocumentStatus.AVAILABLE,
    required: false,
  })
  @IsEnum(DocumentStatus)
  @IsOptional()
  public status?: DocumentStatus;
}
