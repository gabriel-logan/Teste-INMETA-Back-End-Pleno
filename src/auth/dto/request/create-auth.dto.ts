import { ApiProperty } from "@nestjs/swagger";
import { MaxLength, MinLength } from "class-validator";
import { IsNotBlankString } from "src/common/decorators/validation/IsNotBlankString";

export class CreateAuthRequestDto {
  @ApiProperty({
    description:
      "Username for authentication - For demo purposes it will be the CPF of the employee",
    example: "12345678909",
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
}
