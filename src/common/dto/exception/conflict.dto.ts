import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class ConflictExceptionDto {
  @ApiProperty({
    description: "Error message describing the conflict",
    example: "Conflict occurred",
  })
  public readonly message: string;

  @ApiProperty({
    description: "Error type",
    example: "Conflict",
  })
  public readonly error: string;

  @ApiProperty({
    description: "HTTP status code",
    example: HttpStatus.CONFLICT,
  })
  public readonly statusCode: number;
}
