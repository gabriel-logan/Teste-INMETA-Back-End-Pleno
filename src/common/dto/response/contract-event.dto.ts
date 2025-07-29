import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";
import { ContractEventType } from "src/contract-events/schemas/contract-event.schema";

export class ContractEventResponseDto {
  @ApiProperty({
    type: String,
    format: "objectId",
    description: "Unique identifier for the contract event",
    example: "60c72b2f9b1e8b001c8e4d3a",
  })
  public readonly _id: Types.ObjectId;

  @ApiProperty({
    type: String,
    description: "Unique identifier for the contract event",
    example: "60c72b2f9b1e8b001c8e4d3a",
  })
  public readonly id: string;

  @ApiProperty({
    enum: ContractEventType,
    description: "Type of the contract event",
  })
  public readonly type: ContractEventType;

  @ApiProperty({
    type: Date,
    description: "Date of the contract event",
  })
  public readonly date: Date;

  @ApiProperty({
    type: String,
    description: "Reason for the contract event",
  })
  public readonly reason: string;

  @ApiProperty({
    type: String,
    description: "Full name of the employee involved in the contract event",
  })
  public readonly employeeFullName: string;

  @ApiProperty({
    type: String,
    description: "CPF of the employee involved in the contract event",
  })
  public readonly employeeCpf: string;

  @ApiProperty({
    type: Date,
    description: "Timestamp when the contract event was created",
  })
  public readonly createdAt: Date;

  @ApiProperty({
    type: Date,
    description: "Timestamp when the contract event was last updated",
  })
  public readonly updatedAt: Date;
}
