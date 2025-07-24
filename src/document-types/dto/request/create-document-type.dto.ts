import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

export enum DocumentTypeAllowedValues {
  CPF = "CPF",
  CNPJ = "CNPJ",
  CTPS = "CTPS",
  RG = "RG",
  CNH = "CNH",
}

export class CreateDocumentTypeRequestDto {
  @ApiProperty({
    enum: DocumentTypeAllowedValues,
    description: "The name of the document type",
    example: DocumentTypeAllowedValues.CPF,
  })
  @IsEnum(DocumentTypeAllowedValues)
  public name: DocumentTypeAllowedValues;
}
