import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import { IS_PUBLIC_KEY } from "src/common/decorators/routes/public.decorator";
import { AuthPayload } from "src/common/types";
import { EnvSecretConfig } from "src/configs/types";
import { ContractStatus } from "src/employees/schemas/employee.schema";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvSecretConfig, true>,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

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

      if (payload.contractStatus !== ContractStatus.ACTIVE) {
        throw new UnauthorizedException("Contract status is not active");
      }

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
