import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class UnauthorizedExceptionDto {
  @ApiProperty({
    description: "Error message describing the unauthorized access",
    example: "Unauthorized access",
  })
  public message: string;

  @ApiProperty({
    description: "Error type",
    example: "Unauthorized",
  })
  public error: string;

  @ApiProperty({
    description: "HTTP status code",
    example: HttpStatus.UNAUTHORIZED,
  })
  public statusCode: number;
}
