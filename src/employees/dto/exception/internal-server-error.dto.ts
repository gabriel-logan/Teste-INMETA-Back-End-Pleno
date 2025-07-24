import { ApiProperty } from "@nestjs/swagger";

export class InternalServerErrorDto {
  @ApiProperty()
  public message: string;

  @ApiProperty()
  public statusCode: number;
}
