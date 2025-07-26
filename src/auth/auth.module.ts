import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import envSecrets from "src/configs/env.secrets";
import { EnvSecretConfig } from "src/configs/types";
import { EmployeesModule } from "src/employees/employees.module";

import { AuthController } from "./controllers/auth.controller";
import { AuthGuard } from "./guards/auth.guard";
import { AuthService } from "./providers/auth.service";

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(envSecrets)],
      useFactory: (configService: ConfigService<EnvSecretConfig, true>) => {
        const { secret, expiration } =
          configService.get<EnvSecretConfig["jwtToken"]>("jwtToken");

        return {
          secret,
          signOptions: {
            expiresIn: expiration,
          },
        };
      },
      inject: [ConfigService],
    }),
    EmployeesModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
  ],
})
export class AuthModule {}
