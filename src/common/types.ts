import type {
  ContractStatus,
  EmployeeRole,
} from "src/employees/schemas/employee.schema";

export interface AuthPayload {
  sub: string;
  username: string;
  role: EmployeeRole;
  contractStatus: ContractStatus;
}
