import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class ForbiddenExceptionDto {
  @ApiProperty({
    description: "Error message describing the forbidden access",
    example: "Forbidden access",
  })
  public readonly message: string;

  @ApiProperty({
    description: "Error type",
    example: "Forbidden",
  })
  public readonly error: string;

  @ApiProperty({
    description: "HTTP status code",
    example: HttpStatus.FORBIDDEN,
  })
  public readonly statusCode: number;
}
