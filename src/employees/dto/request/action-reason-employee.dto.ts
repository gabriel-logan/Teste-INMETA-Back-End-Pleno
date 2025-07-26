import { ApiProperty } from "@nestjs/swagger";
import { IsNotBlankString } from "src/common/decorators/validation/IsNotBlankString";

export class ActionReasonEmployeeRequestDto {
  @ApiProperty()
  @IsNotBlankString()
  public reason: string;
}

export class FireEmployeeRequestDto extends ActionReasonEmployeeRequestDto {}

export class ReHireEmployeeRequestDto extends ActionReasonEmployeeRequestDto {}
