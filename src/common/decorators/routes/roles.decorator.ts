import type { CustomDecorator } from "@nestjs/common";
import { SetMetadata } from "@nestjs/common";
import type { EmployeeRole } from "src/employees/schemas/employee.schema";

export const ROLES_KEY = "roles";
export const Roles = (...roles: EmployeeRole[]): CustomDecorator<string> =>
  SetMetadata(ROLES_KEY, roles);
