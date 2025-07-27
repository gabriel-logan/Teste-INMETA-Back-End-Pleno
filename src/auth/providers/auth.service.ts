import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcrypt";
import type { AuthPayload } from "src/common/types";
import { EmployeesService } from "src/employees/providers/employees.service";

import { CreateAuthRequestDto } from "../dto/request/create-auth.dto";
import { SignInAuthResponseDto } from "../dto/response/sign-in-auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly employeesService: EmployeesService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    createAuthDto: CreateAuthRequestDto,
  ): Promise<SignInAuthResponseDto> {
    const { username, password } = createAuthDto;

    const employee = await this.employeesService
      .findOneByUsername(username)
      .catch(() => {
        throw new UnauthorizedException("Invalid username or password");
      });

    const isPasswordValid = await compare(password, employee.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid username or password");
    }

    const payload: AuthPayload = {
      username: employee.username,
      sub: employee._id,
      role: employee.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      accessToken: token,
    };
  }
}
