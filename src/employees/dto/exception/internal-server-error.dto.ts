import { ApiProperty } from "@nestjs/swagger";

export class InternalServerErrorDto {
  @ApiProperty({
    example: 500,
    description: "HTTP status code for the internal server error",
  })
  public statusCode: number;

  @ApiProperty()
  public message: string;
}
