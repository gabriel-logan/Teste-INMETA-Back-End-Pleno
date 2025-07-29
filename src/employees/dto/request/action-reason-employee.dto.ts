import { ApiProperty } from "@nestjs/swagger";
import { MaxLength } from "class-validator";
import { IsNotBlankString } from "src/common/decorators/validation/IsNotBlankString";

export class ActionReasonEmployeeRequestDto {
  @ApiProperty()
  @IsNotBlankString()
  @MaxLength(255)
  public reason: string;
}

export class FireEmployeeRequestDto extends ActionReasonEmployeeRequestDto {}

export class ReHireEmployeeRequestDto extends ActionReasonEmployeeRequestDto {}
