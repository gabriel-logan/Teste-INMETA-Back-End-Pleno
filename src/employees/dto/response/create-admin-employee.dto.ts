import { ApiProperty } from "@nestjs/swagger";
import type { Types } from "mongoose";
import { DocumentType } from "src/document-types/schemas/document-type.schema";
import type { ContractStatus } from "src/employees/schemas/employee.schema";

export class CreateAdminEmployeeResponseDto {
  @ApiProperty({
    type: String,
  })
  public id: Types.ObjectId;

  @ApiProperty()
  public firstName: string;

  @ApiProperty()
  public lastName: string;

  @ApiProperty()
  public fullName: string;

  @ApiProperty()
  public contractStatus: ContractStatus;

  @ApiProperty()
  public documentTypes: DocumentType[];

  @ApiProperty()
  public cpf: string;

  @ApiProperty({
    type: String,
  })
  public createdAt: Date;

  @ApiProperty({
    type: String,
  })
  public updatedAt: Date;
}
