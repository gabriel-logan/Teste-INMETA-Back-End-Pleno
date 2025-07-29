import { ApiProperty } from "@nestjs/swagger";

export class DocumentTypeEmployeeLinkedResponseDto {
  @ApiProperty({
    type: String,
    format: "objectId",
    isArray: true,
    example: ["60d5f484f1b2c8b1f8e4a3c1"],
    description:
      "List of DocumentType IDs linked to the Employee, used for document management",
  })
  public readonly documentTypeIdsLinked: string[];

  @ApiProperty({
    type: String,
    format: "objectId",
    isArray: true,
    example: ["60d5f484f1b2c8b1f8e4a3c2"],
    description:
      "List of Document created for the Employee based on linked DocumentTypes",
  })
  public readonly documentIdsCreated: string[];
}
