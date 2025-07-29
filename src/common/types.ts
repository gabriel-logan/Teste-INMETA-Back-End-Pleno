import type { Types } from "mongoose";
import type {
  ContractStatus,
  EmployeeRole,
} from "src/employees/schemas/employee.schema";

export interface AuthPayload {
  sub: Types.ObjectId;
  username: string;
  role: EmployeeRole;
  contractStatus: ContractStatus;
}
