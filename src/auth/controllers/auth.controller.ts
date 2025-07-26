import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import {
  ApiGlobalErrorResponses,
  ApiStandardResponses,
} from "src/common/decorators/routes/docs.decorator";

import { CreateAuthRequestDto } from "../dto/request/create-auth.dto";
import { SignInAuthResponseDto } from "../dto/response/sign-in-auth.dto";
import { AuthService } from "../providers/auth.service";

@ApiGlobalErrorResponses()
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiStandardResponses({
    ok: {
      description: "Successful sign-in",
      type: SignInAuthResponseDto,
    },
    badRequest: true,
    unauthorized: true,
  })
  @Post("sign-in")
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() createAuthDto: CreateAuthRequestDto,
  ): Promise<SignInAuthResponseDto> {
    return await this.authService.signIn(createAuthDto);
  }
}
