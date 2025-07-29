import type { Types } from "mongoose";
import type {
  ContractStatus,
  EmployeeRole,
} from "src/employees/schemas/employee.schema";

import type { ContractEventResponseDto } from "./contract-event.dto";
import type { DocumentTypeResponseDto } from "./document-type.dto";

export class EmployeeFullResponseDto {
  public readonly _id: Types.ObjectId;

  public readonly id: string;

  public readonly firstName: string;

  public readonly lastName: string;

  public readonly fullName: string;

  public readonly username: string;

  public readonly password: string;

  public readonly contractStatus: ContractStatus;

  public readonly contractEvents: ContractEventResponseDto[];

  public readonly cpf: string;

  public readonly role: EmployeeRole;

  public readonly documentTypes: DocumentTypeResponseDto[];

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
}

export class EmployeeFullSecureResponseDto
  implements Omit<EmployeeFullResponseDto, "password">
{
  public readonly _id: Types.ObjectId;

  public readonly id: string;

  public readonly firstName: string;

  public readonly lastName: string;

  public readonly fullName: string;

  public readonly username: string;

  public readonly contractStatus: ContractStatus;

  public readonly contractEvents: ContractEventResponseDto[];

  public readonly cpf: string;

  public readonly role: EmployeeRole;

  public readonly documentTypes: DocumentTypeResponseDto[];

  public readonly createdAt: Date;

  public readonly updatedAt: Date;
}

export class EmployeeSecureWithoutDocumentTypesResponseDto
  implements Omit<EmployeeFullSecureResponseDto, "documentTypes">
{
  public readonly _id: Types.ObjectId;

  public readonly id: string;

  public readonly firstName: string;

  public readonly lastName: string;

  public readonly fullName: string;

  public readonly username: string;

  public readonly contractStatus: ContractStatus;

  public readonly contractEvents: ContractEventResponseDto[];

  public readonly cpf: string;

  public readonly role: EmployeeRole;

  public readonly createdAt: Date;

  public readonly updatedAt: Date;
}

export class EmployeeSecureWithoutContractEventsResponseDto
  implements Omit<EmployeeFullSecureResponseDto, "contractEvents">
{
  public readonly _id: Types.ObjectId;

  public readonly id: string;

  public readonly firstName: string;

  public readonly lastName: string;

  public readonly fullName: string;

  public readonly username: string;

  public readonly contractStatus: ContractStatus;

  public readonly cpf: string;

  public readonly role: EmployeeRole;

  public readonly documentTypes: DocumentTypeResponseDto[];

  public readonly createdAt: Date;

  public readonly updatedAt: Date;
}

export class EmployeeSecureRawResponseDto
  implements
    Omit<EmployeeFullSecureResponseDto, "documentTypes" | "contractEvents">
{
  public readonly _id: Types.ObjectId;

  public readonly id: string;

  public readonly firstName: string;

  public readonly lastName: string;

  public readonly fullName: string;

  public readonly username: string;

  public readonly contractStatus: ContractStatus;

  public readonly cpf: string;

  public readonly role: EmployeeRole;

  public readonly createdAt: Date;

  public readonly updatedAt: Date;
}
