import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class BadRequestExceptionDto {
  @ApiProperty({
    example: HttpStatus.BAD_REQUEST,
    description: "HTTP status code for the bad request",
  })
  public readonly statusCode: number;

  @ApiProperty({
    description: "Error message describing the bad request",
    oneOf: [
      { type: "string", example: "Invalid input data" },
      {
        type: "array",
        items: { type: "string" },
        example: ["Invalid input data", "Missing required fields"],
      },
    ],
  })
  public readonly message: string | string[];

  @ApiProperty({
    example: "Bad Request",
    description: "Error message describing the bad request",
  })
  public readonly error: string;
}
