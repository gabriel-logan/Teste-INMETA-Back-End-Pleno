import { ApiProperty } from "@nestjs/swagger";

export class SignInAuthResponseDto {
  @ApiProperty()
  public readonly accessToken: string;
}
