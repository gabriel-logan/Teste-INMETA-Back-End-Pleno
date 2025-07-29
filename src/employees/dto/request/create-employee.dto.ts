import { ApiProperty } from "@nestjs/swagger";
import { MinLength } from "class-validator";
import { IsCpf } from "src/common/decorators/validation/IsCpf";
import { IsNotBlankString } from "src/common/decorators/validation/IsNotBlankString";

export class CreateEmployeeRequestDto {
  @ApiProperty()
  @IsNotBlankString()
  public firstName: string;

  @ApiProperty()
  @IsNotBlankString()
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
  @MinLength(6)
  public password: string;
}
