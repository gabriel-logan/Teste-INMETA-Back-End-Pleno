import { ApiProperty } from "@nestjs/swagger";
import type { Types } from "mongoose";
import { DocumentTypeResponseDto } from "src/common/dto/response/document-type.dto";
import {
  ContractStatus,
  EmployeeRole,
} from "src/employees/schemas/employee.schema";

export class CreateAdminEmployeeResponseDto {
  @ApiProperty({
    type: String,
    format: "objectId",
  })
  public readonly _id: Types.ObjectId;

  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly firstName: string;

  @ApiProperty()
  public readonly lastName: string;

  @ApiProperty()
  public readonly fullName: string;

  @ApiProperty({
    enum: ContractStatus,
    example: ContractStatus.ACTIVE,
  })
  public readonly contractStatus: ContractStatus;

  @ApiProperty({ enum: EmployeeRole, example: EmployeeRole.ADMIN })
  public readonly role: EmployeeRole;

  @ApiProperty({
    type: DocumentTypeResponseDto,
    format: "objectId",
    isArray: true,
    description: "List of DocumentType IDs linked to the Employee",
    default: [],
  })
  public readonly documentTypes: DocumentTypeResponseDto[];

  @ApiProperty({
    type: String,
    format: "CPF",
    example: "12345678900",
    description: "The CPF (Cadastro de Pessoas Físicas) of the employee",
  })
  public readonly cpf: string;

  @ApiProperty({
    type: Date,
  })
  public readonly createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  public readonly updatedAt: Date;
}
