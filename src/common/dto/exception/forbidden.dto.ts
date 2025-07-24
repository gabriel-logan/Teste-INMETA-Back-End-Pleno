import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class ForbiddenExceptionDto {
  @ApiProperty({
    description: "Error message describing the forbidden access",
    example: "Forbidden access",
  })
  public message: string;

  @ApiProperty({
    description: "Error type",
    example: "Forbidden",
  })
  public error: string;

  @ApiProperty({
    description: "HTTP status code",
    example: HttpStatus.FORBIDDEN,
  })
  public statusCode: number;
}
