import { ApiProperty } from "@nestjs/swagger";
import { MaxLength, MinLength } from "class-validator";
import { validationConstraints } from "src/common/constants";
import { IsCpf } from "src/common/decorators/validation/IsCpf";
import { IsNotBlankString } from "src/common/decorators/validation/IsNotBlankString";

export class CreateEmployeeRequestDto {
  @ApiProperty()
  @IsNotBlankString()
  @MaxLength(validationConstraints.employee.firstName.maxLength)
  public firstName: string;

  @ApiProperty()
  @IsNotBlankString()
  @MaxLength(validationConstraints.employee.lastName.maxLength)
  public lastName: string;

  @ApiProperty({
    type: String,
    description: "The CPF (Cadastro de Pessoas Físicas) of the employee",
    example: "12345678909",
  })
  @IsCpf()
  public cpf: string;

  @ApiProperty({
    type: String,
    description: "The password for the employee's account",
    example: "securePassword123",
  })
  @IsNotBlankString()
  @MinLength(validationConstraints.employee.password.minLength)
  @MaxLength(validationConstraints.employee.password.maxLength)
  public password: string;
}
