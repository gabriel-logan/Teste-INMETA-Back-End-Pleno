import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class ThrottlerExceptionDto {
  @ApiProperty({
    example: HttpStatus.TOO_MANY_REQUESTS,
  })
  public readonly statusCode: number;

  @ApiProperty({
    example: "ThrottlerException: Too Many Requests",
  })
  public readonly message: string;
}
