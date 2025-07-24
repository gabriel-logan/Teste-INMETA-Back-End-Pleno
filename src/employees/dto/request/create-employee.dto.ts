import { ApiProperty } from "@nestjs/swagger";
import { IsNotBlankString } from "src/common/decorators/validation/IsNotBlankString";

export class CreateEmployeeRequestDto {
  @ApiProperty()
  @IsNotBlankString()
  public name: string;
}
