import { ApiProperty } from "@nestjs/swagger";
import { MaxLength, MinLength } from "class-validator";
import { IsCpf } from "src/common/decorators/validation/IsCpf";
import { IsNotBlankString } from "src/common/decorators/validation/IsNotBlankString";

export class CreateAdminEmployeeRequestDto {
  @ApiProperty({
    description: "First name of the employee",
    example: "John",
    maxLength: 30,
    minLength: 3,
  })
  @IsNotBlankString()
  @MaxLength(30)
  @MinLength(3)
  public firstName: string;

  @ApiProperty({
    description: "Last name of the employee",
    example: "Doe",
    maxLength: 40,
    minLength: 3,
  })
  @IsNotBlankString()
  @MaxLength(40)
  @MinLength(3)
  public lastName: string;

  @ApiProperty({
    maxLength: 40,
    minLength: 3,
  })
  @IsNotBlankString()
  @MaxLength(40)
  @MinLength(3)
  public username: string;

  @ApiProperty({
    description: "Password for authentication",
    default: "123456",
    maxLength: 255,
    minLength: 6,
  })
  @IsNotBlankString()
  @MinLength(6)
  @MaxLength(255)
  public password: string;

  @ApiProperty({
    description: "CPF of the employee",
    example: "12345678909",
  })
  @IsNotBlankString()
  @IsCpf()
  public cpf: string;
}
