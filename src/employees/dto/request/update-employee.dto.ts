import { PartialType } from "@nestjs/swagger";

import { CreateEmployeeRequestDto } from "./create-employee.dto";

export class UpdateEmployeeRequestDto extends PartialType(
  CreateEmployeeRequestDto,
) {}
