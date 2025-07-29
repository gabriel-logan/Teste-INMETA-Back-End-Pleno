import { ApiProperty } from "@nestjs/swagger";
import { DocumentTypeAllowedValues } from "src/document-types/schemas/document-type.schema";
import { DocumentStatus } from "src/documents/schemas/document.schema";

class DocumentStatusInfoDto {
  @ApiProperty({
    type: String,
    format: "objectId",
    example: "60c72b2f9b1e8d001c8e4f3a",
  })
  public readonly documentId: string;

  @ApiProperty({ enum: DocumentStatus })
  public readonly status: DocumentStatus;
}

class DocumentStatusEntryDto {
  @ApiProperty({
    enum: DocumentTypeAllowedValues,
    description: "The name of the document type",
  })
  public readonly documentName: DocumentTypeAllowedValues;

  @ApiProperty({ type: DocumentStatusInfoDto })
  public readonly documentStatus: DocumentStatusInfoDto;
}

export class GetDocumentStatusesByEmployeeIdResponseDto {
  @ApiProperty({
    type: DocumentStatusEntryDto,
    isArray: true,
    description: "List of document statuses by employee ID",
  })
  public readonly documentStatuses: DocumentStatusEntryDto[];
}
