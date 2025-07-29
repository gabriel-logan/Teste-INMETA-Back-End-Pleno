import { ApiProperty } from "@nestjs/swagger";
import { MaxLength, MinLength } from "class-validator";
import { validationConstraints } from "src/common/constants";
import { IsCpf } from "src/common/decorators/validation/IsCpf";
import { IsNotBlankString } from "src/common/decorators/validation/IsNotBlankString";

export class CreateAdminEmployeeRequestDto {
  @ApiProperty({
    description: "First name of the employee",
    example: "John",
    maxLength: validationConstraints.employee.firstName.maxLength,
    minLength: validationConstraints.employee.firstName.minLength,
  })
  @IsNotBlankString()
  @MaxLength(validationConstraints.employee.firstName.maxLength)
  @MinLength(validationConstraints.employee.firstName.minLength)
  public firstName: string;

  @ApiProperty({
    description: "Last name of the employee",
    example: "Doe",
    maxLength: validationConstraints.employee.lastName.maxLength,
    minLength: validationConstraints.employee.lastName.minLength,
  })
  @IsNotBlankString()
  @MaxLength(validationConstraints.employee.lastName.maxLength)
  @MinLength(validationConstraints.employee.lastName.minLength)
  public lastName: string;

  @ApiProperty({
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
  @MinLength(validationConstraints.employee.password.minLength)
  @MaxLength(validationConstraints.employee.password.maxLength)
  public password: string;

  @ApiProperty({
    description: "CPF of the employee",
    example: "12345678909",
  })
  @IsNotBlankString()
  @IsCpf()
  public cpf: string;
}
