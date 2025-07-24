import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { Types } from "mongoose";
import { IsNotBlankString } from "src/common/decorators/validation/IsNotBlankString";
import { DocumentStatus } from "src/documents/schemas/document.schema";

export class CreateDocumentRequestDto {
  @ApiProperty({
    type: String,
    format: "ObjectId",
    description: "The ID of the employee to whom the document belongs",
    example: "1234567890abcdef12345678",
  })
  @IsNotBlankString()
  public documentTypeId: Types.ObjectId;

  @ApiProperty({
    enum: DocumentStatus,
    description: "The status of the document",
    example: DocumentStatus.MISSING,
  })
  @IsEnum(DocumentStatus)
  public status: DocumentStatus;

  @ApiProperty({
    description: "The ID of the employee to whom the document belongs",
    example: "1234567890abcdef12345678",
    type: String,
  })
  @IsNotBlankString()
  public employeeId: Types.ObjectId;
}
