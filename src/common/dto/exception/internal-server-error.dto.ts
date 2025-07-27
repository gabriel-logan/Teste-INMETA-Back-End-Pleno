import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class InternalServerErrorDto {
  @ApiProperty({
    example: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "HTTP status code for the internal server error",
  })
  public readonly statusCode: number;

  @ApiProperty()
  public readonly message: string;
}
