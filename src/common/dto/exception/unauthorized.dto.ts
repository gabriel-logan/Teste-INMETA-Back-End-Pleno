import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class UnauthorizedExceptionDto {
  @ApiProperty({
    description: "Error message describing the unauthorized access",
    example: "Unauthorized access",
  })
  public readonly message: string;

  @ApiProperty({
    description: "Error type",
    example: "Unauthorized",
  })
  public readonly error: string;

  @ApiProperty({
    description: "HTTP status code",
    example: HttpStatus.UNAUTHORIZED,
  })
  public readonly statusCode: number;
}
