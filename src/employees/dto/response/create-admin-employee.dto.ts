import { ApiProperty } from "@nestjs/swagger";
import type { Types } from "mongoose";
import { DocumentTypeResponseDto } from "src/common/dto/response/document-type.dto";
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

  @ApiProperty({
    type: DocumentTypeResponseDto,
    format: "objectId",
    isArray: true,
    description: "List of DocumentType IDs linked to the Employee",
    default: [],
  })
  public readonly documentTypes: DocumentTypeResponseDto[];

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
