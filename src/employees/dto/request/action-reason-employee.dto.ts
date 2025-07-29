import { ApiProperty } from "@nestjs/swagger";
import { MaxLength } from "class-validator";
import { validationConstraints } from "src/common/constants";
import { IsNotBlankString } from "src/common/decorators/validation/IsNotBlankString";

export class ActionReasonEmployeeRequestDto {
  @ApiProperty()
  @IsNotBlankString()
  @MaxLength(validationConstraints.contractEvent.reason.maxLength)
  public reason: string;
}

export class FireEmployeeRequestDto extends ActionReasonEmployeeRequestDto {}

export class ReHireEmployeeRequestDto extends ActionReasonEmployeeRequestDto {}
