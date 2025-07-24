import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";
import { Document } from "src/documents/schemas/document.schema";
import type { Employee } from "src/employees/schemas/employee.schema";

export class PublicEmployeeResponseDto implements Employee {
  @ApiProperty({
    type: String,
    format: "ObjectId",
    description: "Unique identifier for the employee",
    example: "60c72b2f9b1e8c001c8f8e1d",
  })
  public id: Types.ObjectId;

  @ApiProperty()
  public name: string;

  @ApiProperty({
    type: Date,
    description: "The date and time when the employee was hired",
    example: "2021-06-14T10:00:00Z",
    nullable: true,
  })
  public hiredAt: Date | null;

  @ApiProperty({
    type: Document,
    description: "List of documents associated with the employee",
    isArray: true,
    example: [
      {
        id: "688208436df1ac7fbf95320e",
        documentType: {
          _id: "688205905a14025cdfb57ae5",
          name: "CPF",
          createdAt: "2025-07-24T10:06:08.724Z",
          updatedAt: "2025-07-24T10:06:08.724Z",
          __v: 0,
        },
        status: "missing",
        createdAt: "2025-07-24T10:17:39.376Z",
        updatedAt: "2025-07-24T10:24:43.801Z",
      },
    ],
  })
  public documents: Document[];

  @ApiProperty({
    type: Date,
    description: "The date and time when the employee was created",
    example: "2021-06-14T10:00:00Z",
  })
  public createdAt: Date;

  @ApiProperty({
    type: Date,
    description: "The date and time when the employee was last updated",
    example: "2021-06-14T10:00:00Z",
  })
  public updatedAt: Date;
}
