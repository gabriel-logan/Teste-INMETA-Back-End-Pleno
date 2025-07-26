import { ApiProperty } from "@nestjs/swagger";

export class SignInAuthResponseDto {
  @ApiProperty()
  public accessToken: string;
}
