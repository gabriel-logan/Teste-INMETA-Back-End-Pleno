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
    type: Document,
    description: "List of documents associated with the employee",
    isArray: true,
    default: null,
  })
  public documents: Document[] | null;

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
