import { ApiProperty } from "@nestjs/swagger";

export class NotFoundExceptionDto {
  @ApiProperty()
  public message: string;

  @ApiProperty({
    example: "Not Found",
    description: "HTTP error message for the not found exception",
  })
  public error: string;

  @ApiProperty({
    example: 404,
    description: "HTTP status code for the not found error",
  })
  public statusCode: number;
}
