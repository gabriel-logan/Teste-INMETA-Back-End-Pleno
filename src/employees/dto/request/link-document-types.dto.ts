import { ApiProperty } from "@nestjs/swagger";
import { IsObjectIdArrayString } from "src/common/decorators/validation/IsObjectIdArrayString";
import { IsUniqueArray } from "src/common/decorators/validation/IsUniqueArray";

export class LinkDocumentTypesDto {
  @ApiProperty({
    description: "Array of document type IDs to link to the employee",
    type: String,
    example: ["60d5ec49f1b2c8b1f8e4e3a1", "60d5ec49f1b2c8b1f8e4e3a2"],
    isArray: true,
  })
  @IsObjectIdArrayString()
  @IsUniqueArray()
  public documentTypeIds: string[];
}
