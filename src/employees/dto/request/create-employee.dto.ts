import { IsNotBlankString } from "src/common/decorators/validation/IsNotBlankString";

export class CreateEmployeeRequestDto {
  @IsNotBlankString()
  public name: string;
}
