import { ApiProperty } from "@nestjs/swagger";
import { IsCpf } from "src/common/decorators/validation/IsCpf";
import { IsNotBlankString } from "src/common/decorators/validation/IsNotBlankString";

export class CreateEmployeeRequestDto {
  @ApiProperty()
  @IsNotBlankString()
  public name: string;

  @ApiProperty({
    type: String,
    description: "The CPF (Cadastro de Pessoas Físicas) of the employee",
    example: "12345678909",
  })
  @IsCpf()
  public cpf: string;
}
