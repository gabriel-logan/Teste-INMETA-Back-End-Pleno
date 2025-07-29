import { ApiProperty } from "@nestjs/swagger";

export class DocumentTypeEmployeeUnlinkedResponseDto {
  @ApiProperty({
    type: String,
    format: "objectId",
    isArray: true,
    example: ["60d5f484f1b2c8b1f8e4a3c1"],
  })
  public readonly documentTypeIdsUnlinked: string[];

  @ApiProperty({
    type: String,
    format: "objectId",
    isArray: true,
    example: ["60d5f484f1b2c8b1f8e4a3c2"],
    description:
      "List of Document IDs deleted for the Employee based on unlinked DocumentTypes",
  })
  public readonly documentIdsDeleted: string[];
}
