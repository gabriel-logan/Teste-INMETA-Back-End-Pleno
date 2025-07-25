import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { DocumentStatus } from "src/documents/schemas/document.schema";

import { CreateDocumentRequestDto } from "./create-document.dto";

export class UpdateDocumentRequestDto extends PartialType(
  CreateDocumentRequestDto,
) {
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
