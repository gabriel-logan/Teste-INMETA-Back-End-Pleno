import { ApiProperty } from "@nestjs/swagger";
import { IsObjectIdString } from "src/common/decorators/validation/IsObjectIdString";

export class CreateDocumentRequestDto {
  @ApiProperty({
    type: String,
    format: "ObjectId",
    description: "The ID of the employee to whom the document belongs",
    example: "60c72b2f9b1e8c001c8f8e1d",
  })
  @IsObjectIdString()
  public documentTypeId: string;

  @ApiProperty({
    type: String,
    format: "ObjectId",
    description: "The ID of the employee to whom the document belongs",
    example: "1234567890abcdef12345678",
  })
  @IsObjectIdString()
  public employeeId: string;
}
