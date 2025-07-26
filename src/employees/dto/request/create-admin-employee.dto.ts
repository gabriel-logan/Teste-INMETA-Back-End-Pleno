import { ApiProperty } from "@nestjs/swagger";
import { Length, MaxLength, MinLength } from "class-validator";
import { IsNotBlankString } from "src/common/decorators/validation/IsNotBlankString";

export class CreateAdminEmployeeRequestDto {
  @ApiProperty({
    description: "First name of the employee",
    example: "John",
    maxLength: 255,
    minLength: 3,
  })
  @IsNotBlankString()
  @MaxLength(255)
  @MinLength(3)
  public firstName: string;

  @ApiProperty({
    description: "Last name of the employee",
    example: "Doe",
    maxLength: 255,
    minLength: 3,
  })
  @IsNotBlankString()
  @MaxLength(255)
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
    maxLength: 11,
    minLength: 11,
  })
  @IsNotBlankString()
  @Length(11, 11)
  public cpf: string;
}
