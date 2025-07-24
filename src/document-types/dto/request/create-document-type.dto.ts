import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { DocumentTypeAllowedValues } from "src/document-types/schemas/document-type.schema";

export class CreateDocumentTypeRequestDto {
  @ApiProperty({
    enum: DocumentTypeAllowedValues,
    description: "The name of the document type",
    example: DocumentTypeAllowedValues.CPF,
  })
  @IsEnum(DocumentTypeAllowedValues)
  public name: DocumentTypeAllowedValues;
}
