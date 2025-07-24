import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";
import type { Employee } from "src/employees/schemas/employee.schema";

export class PublicEmployeeResponseDto implements Employee {}
