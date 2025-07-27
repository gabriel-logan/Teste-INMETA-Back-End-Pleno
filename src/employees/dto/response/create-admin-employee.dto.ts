import { ApiProperty } from "@nestjs/swagger";
import type { Types } from "mongoose";
import { DocumentType } from "src/document-types/schemas/document-type.schema";
import type { ContractStatus } from "src/employees/schemas/employee.schema";

export class CreateAdminEmployeeResponseDto {
  @ApiProperty({
    type: String,
  })
  public readonly id: Types.ObjectId;

  @ApiProperty()
  public readonly firstName: string;

  @ApiProperty()
  public readonly lastName: string;

  @ApiProperty()
  public readonly fullName: string;

  @ApiProperty()
  public readonly contractStatus: ContractStatus;

  @ApiProperty()
  public readonly documentTypes: DocumentType[];

  @ApiProperty()
  public readonly cpf: string;

  @ApiProperty({
    type: String,
  })
  public readonly createdAt: Date;

  @ApiProperty({
    type: String,
  })
  public readonly updatedAt: Date;
}
