import type { Types } from "mongoose";
import type { EmployeeRole } from "src/employees/schemas/employee.schema";

export interface AuthPayload {
  sub: Types.ObjectId;
  username: string;
  role: EmployeeRole;
}
