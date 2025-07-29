import { ApiProperty } from "@nestjs/swagger";
import type { Types } from "mongoose";
import {
  ContractStatus,
  EmployeeRole,
} from "src/employees/schemas/employee.schema";

import { ContractEventResponseDto } from "./contract-event.dto";
import { DocumentTypeResponseDto } from "./document-type.dto";

export class EmployeeBaseResponseDto {
  @ApiProperty({
    type: String,
    format: "objectId",
    description: "The unique identifier of the employee",
    example: "60c72b2f9b1e8d3f48b4567",
  })
  public readonly _id: Types.ObjectId;

  @ApiProperty({
    type: String,
    description: "The unique identifier of the employee",
    example: "60c72b2f9b1e8d3f48b4567",
  })
  public readonly id: string;

  @ApiProperty({
    type: String,
    description: "The first name of the employee",
  })
  public readonly firstName: string;

  @ApiProperty({
    type: String,
    description: "The last name of the employee",
  })
  public readonly lastName: string;

  @ApiProperty({
    type: String,
    description: "The full name of the employee",
  })
  public readonly fullName: string;

  @ApiProperty({
    type: String,
    description: "The username of the employee",
  })
  public readonly username: string;

  @ApiProperty({
    enum: ContractStatus,
    description: "The contract status of the employee",
  })
  public readonly contractStatus: ContractStatus;

  @ApiProperty({
    type: String,
    description: "The CPF of the employee",
  })
  public readonly cpf: string;

  @ApiProperty({
    type: Date,
    description: "The creation date of the employee",
  })
  public readonly createdAt: Date;

  @ApiProperty({
    type: Date,
    description: "The last update date of the employee",
  })
  public readonly updatedAt: Date;
}

export class EmployeeFullResponseDto extends EmployeeBaseResponseDto {
  @ApiProperty({
    type: ContractEventResponseDto,
    isArray: true,
    description: "The contract events of the employee",
  })
  public readonly contractEvents: ContractEventResponseDto[];

  @ApiProperty({
    type: DocumentTypeResponseDto,
    isArray: true,
    description: "The document types associated with the employee",
  })
  public readonly documentTypes: DocumentTypeResponseDto[];
}

export class EmployeeWithDocumentTypesResponseDto extends EmployeeBaseResponseDto {
  @ApiProperty({
    type: DocumentTypeResponseDto,
    isArray: true,
    description: "The document types associated with the employee",
  })
  public readonly documentTypes: DocumentTypeResponseDto[];
}

export class EmployeeWithContractEventsResponseDto extends EmployeeBaseResponseDto {
  @ApiProperty({
    type: ContractEventResponseDto,
    isArray: true,
    description: "The contract events of the employee",
  })
  public readonly contractEvents: ContractEventResponseDto[];
}

export class EmployeeInternalResponseDto extends EmployeeFullResponseDto {
  public readonly role: EmployeeRole;

  public readonly password: string;
}
