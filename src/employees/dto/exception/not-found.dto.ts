import { ApiProperty } from "@nestjs/swagger";

export class NotFoundExceptionDto {
  @ApiProperty()
  public message: string;

  @ApiProperty()
  public statusCode: number;
}
