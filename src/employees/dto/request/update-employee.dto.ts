import { OmitType, PartialType } from "@nestjs/swagger";

import { CreateEmployeeRequestDto } from "./create-employee.dto";

export class UpdateEmployeeRequestDto extends PartialType(
  OmitType(CreateEmployeeRequestDto, ["password"]),
) {}
