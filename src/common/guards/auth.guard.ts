import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import { AuthPayload } from "src/common/types";
import { EnvSecretConfig } from "src/configs/types";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvSecretConfig, true>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("No token provided");
    }

    const { secret } =
      this.configService.get<EnvSecretConfig["jwtToken"]>("jwtToken");

    try {
      const payload: AuthPayload = await this.jwtService.verifyAsync(token, {
        secret,
      });

      request["employee"] = payload;
    } catch {
      throw new UnauthorizedException("Token is invalid or expired");
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
