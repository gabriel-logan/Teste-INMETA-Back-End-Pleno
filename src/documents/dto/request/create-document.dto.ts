import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { IsObjectIdArrayString } from "src/common/decorators/validation/IsObjectIdArrayString";
import { IsObjectIdString } from "src/common/decorators/validation/IsObjectIdString";
import { DocumentStatus } from "src/documents/schemas/document.schema";

export class CreateDocumentRequestDto {
  @ApiProperty({
    type: String,
    format: "ObjectId",
    description: "The ID of the employee to whom the document belongs",
    example: ["1234567890abcdef12345678", "abcdef1234567890abcdef12"],
    isArray: true,
  })
  @IsObjectIdArrayString()
  public documentTypeIds: string[];

  @ApiProperty({
    enum: DocumentStatus,
    description: "The status of the document",
    example: DocumentStatus.MISSING,
  })
  @IsEnum(DocumentStatus)
  public status: DocumentStatus;

  @ApiProperty({
    type: String,
    format: "ObjectId",
    description: "The ID of the employee to whom the document belongs",
    example: "1234567890abcdef12345678",
  })
  @IsObjectIdString()
  public employeeId: string;
}
