import { ApiProperty } from "@nestjs/swagger";
import { MaxLength, MinLength } from "class-validator";
import { IsNotBlankString } from "src/common/decorators/validation/IsNotBlankString";

export class CreateAuthRequestDto {
  @ApiProperty()
  @IsNotBlankString()
  @MaxLength(40)
  @MinLength(3)
  public username: string;

  @ApiProperty()
  @IsNotBlankString()
  @MinLength(6)
  @MaxLength(255)
  public password: string;
}
