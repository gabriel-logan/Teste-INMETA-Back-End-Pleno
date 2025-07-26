import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { DocumentStatus } from "src/documents/schemas/document.schema";

export class UpdateDocumentRequestDto {
  @ApiProperty({
    enum: DocumentStatus,
    description: "The status of the document",
    examples: [DocumentStatus.AVAILABLE, DocumentStatus.MISSING],
    required: false,
  })
  @IsEnum(DocumentStatus)
  @IsOptional()
  public status?: DocumentStatus;
}
