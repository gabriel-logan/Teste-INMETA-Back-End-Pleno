import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class NotFoundExceptionDto {
  @ApiProperty()
  public readonly message: string;

  @ApiProperty({
    example: "Not Found",
    description: "HTTP error message for the not found exception",
  })
  public readonly error: string;

  @ApiProperty({
    example: HttpStatus.NOT_FOUND,
    description: "HTTP status code for the not found error",
  })
  public readonly statusCode: number;
}
