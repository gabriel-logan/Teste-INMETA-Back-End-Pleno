import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class ConflictExceptionDto {
  @ApiProperty({
    description: "Error message describing the conflict",
    example: "Conflict occurred",
  })
  public message: string;

  @ApiProperty({
    description: "Error type",
    example: "Conflict",
  })
  public error: string;

  @ApiProperty({
    description: "HTTP status code",
    example: HttpStatus.CONFLICT,
  })
  public statusCode: number;
}
