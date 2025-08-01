import { ApiProperty } from "@nestjs/swagger";
import { MaxLength, MinLength } from "class-validator";
import { validationConstraints } from "src/common/constants";
import { IsNotBlankString } from "src/common/decorators/validation/IsNotBlankString";

export class CreateAuthRequestDto {
  @ApiProperty({
    description:
      "Username for authentication - For demo purposes it will be the CPF of the employee",
    example: "12345678909",
    maxLength: validationConstraints.employee.username.maxLength,
    minLength: validationConstraints.employee.username.minLength,
  })
  @IsNotBlankString()
  @MaxLength(validationConstraints.employee.username.maxLength)
  @MinLength(validationConstraints.employee.username.minLength)
  public username: string;

  @ApiProperty({
    description: "Password for authentication",
    default: "123456",
    maxLength: validationConstraints.employee.password.maxLength,
    minLength: validationConstraints.employee.password.minLength,
  })
  @IsNotBlankString()
  @MaxLength(validationConstraints.employee.password.maxLength)
  @MinLength(validationConstraints.employee.password.minLength)
  public password: string;
}
