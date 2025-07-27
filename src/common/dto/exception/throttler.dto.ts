import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class ThrottlerExceptionDto {
  @ApiProperty({
    example: HttpStatus.TOO_MANY_REQUESTS,
  })
  public statusCode: number;

  @ApiProperty({
    example: "ThrottlerException: Too Many Requests",
  })
  public message: string;
}
