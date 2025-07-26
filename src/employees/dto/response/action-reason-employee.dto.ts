import { ApiProperty } from "@nestjs/swagger";
import { IsNotBlankString } from "src/common/decorators/validation/IsNotBlankString";

export class ActionReasonEmployeeResponseDto {
  @ApiProperty()
  @IsNotBlankString()
  public reason: string;

  @ApiProperty()
  @IsNotBlankString()
  public message: string;
}

export class FireEmployeeResponseDto extends ActionReasonEmployeeResponseDto {}

export class HireAgainEmployeeResponseDto extends ActionReasonEmployeeResponseDto {}
