import { ApiProperty } from "@nestjs/swagger";

export class DocumentTypeEmployeeUnlinkedResponseDto {
  @ApiProperty({
    type: String,
    format: "objectId",
    isArray: true,
    example: ["60d5f484f1b2c8b1f8e4a3c1"],
  })
  public documentTypeIdsUnlinked: string[];
}
