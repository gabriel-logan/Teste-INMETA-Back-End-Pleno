import { ApiProperty } from "@nestjs/swagger";
import { MinLength } from "class-validator";
import { IsNotBlankString } from "src/common/decorators/validation/IsNotBlankString";

export class UpdateEmployeePasswordRequestDto {
  @ApiProperty({
    type: String,
    description: "The new password for the employee",
    example: "newPassword123",
  })
  @IsNotBlankString()
  @MinLength(6)
  public newPassword: string;

  @ApiProperty({
    type: String,
    description: "The current password for the employee",
    example: "currentPassword123",
  })
  @IsNotBlankString()
  @MinLength(6)
  public currentPassword: string;
}
