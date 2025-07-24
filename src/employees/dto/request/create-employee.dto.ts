import { ApiProperty } from "@nestjs/swagger";
import { IsCpf } from "src/common/decorators/validation/IsCpf";
import { IsNotBlankString } from "src/common/decorators/validation/IsNotBlankString";

export class CreateEmployeeRequestDto {
  @ApiProperty()
  @IsNotBlankString()
  public name: string;

  @ApiProperty()
  @IsCpf()
  public cpf: string;
}
