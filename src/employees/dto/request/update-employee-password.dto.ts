import { ApiProperty } from "@nestjs/swagger";
import { MaxLength, MinLength } from "class-validator";
import { validationConstraints } from "src/common/constants";
import { IsNotBlankString } from "src/common/decorators/validation/IsNotBlankString";

export class UpdateEmployeePasswordRequestDto {
  @ApiProperty({
    type: String,
    description: "The new password for the employee",
    example: "newPassword123",
  })
  @IsNotBlankString()
  @MinLength(validationConstraints.employee.password.minLength)
  @MaxLength(validationConstraints.employee.password.maxLength)
  public newPassword: string;
}
