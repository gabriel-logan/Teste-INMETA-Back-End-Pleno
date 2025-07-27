import { ApiProperty } from "@nestjs/swagger";
import { IsNotBlankString } from "src/common/decorators/validation/IsNotBlankString";

export class ActionReasonEmployeeResponseDto {
  @ApiProperty()
  @IsNotBlankString()
  public readonly reason: string;

  @ApiProperty()
  @IsNotBlankString()
  public readonly message: string;
}

export class FireEmployeeResponseDto extends ActionReasonEmployeeResponseDto {}

export class ReHireEmployeeResponseDto extends ActionReasonEmployeeResponseDto {}
