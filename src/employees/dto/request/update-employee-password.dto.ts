import { ApiProperty } from "@nestjs/swagger";
import { MaxLength, MinLength } from "class-validator";
import { IsNotBlankString } from "src/common/decorators/validation/IsNotBlankString";

export class UpdateEmployeePasswordRequestDto {
  @ApiProperty({
    type: String,
    description: "The new password for the employee",
    example: "newPassword123",
  })
  @IsNotBlankString()
  @MinLength(6)
  @MaxLength(255)
  public newPassword: string;
}
