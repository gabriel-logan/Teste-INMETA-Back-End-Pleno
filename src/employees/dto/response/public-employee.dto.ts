import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";
import { DocumentType } from "src/document-types/schemas/document-type.schema";
import { ContractStatus } from "src/employees/schemas/employee.schema";

export class PublicEmployeeResponseDto {
  @ApiProperty({
    type: String,
    format: "ObjectId",
    description: "Unique identifier for the employee",
    example: "60c72b2f9b1e8c001c8f8e1d",
  })
  public readonly id: Types.ObjectId;

  @ApiProperty()
  public readonly firstName: string;

  @ApiProperty()
  public readonly lastName: string;

  @ApiProperty()
  public readonly fullName: string;

  @ApiProperty({
    enum: ContractStatus,
    description: "The current status of the employee's contract",
    example: ContractStatus.ACTIVE,
  })
  public readonly contractStatus: ContractStatus;

  @ApiProperty({
    type: DocumentType,
    isArray: true,
    description: "List of document types associated with the employee",
  })
  public readonly documentTypes: DocumentType[];

  @ApiProperty({
    type: String,
    description: "The CPF (Cadastro de Pessoas Físicas) of the employee",
    example: "12345678909",
  })
  public readonly cpf: string;

  @ApiProperty({
    type: Date,
    description: "The date and time when the employee was created",
    example: "2021-06-14T10:00:00Z",
  })
  public readonly createdAt: Date;

  @ApiProperty({
    type: Date,
    description: "The date and time when the employee was last updated",
    example: "2021-06-14T10:00:00Z",
  })
  public readonly updatedAt: Date;
}
