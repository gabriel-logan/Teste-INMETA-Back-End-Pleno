import { IsNotBlankString } from "src/common/decorators/validation/IsNotBlankString";

export class CreateEmployeeDto {
  @IsNotBlankString()
  public name: string;
}
