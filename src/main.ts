import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import type { EnvGlobalConfig } from "./configs/types";

const logger = new Logger("Bootstrap");

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<EnvGlobalConfig, true>);

  const { nodeEnv, baseUrl, port } =
    configService.get<EnvGlobalConfig["server"]>("server");

  await app.listen(port);

  logger.log(`Application is running on: ${baseUrl}`);
  logger.log(`Environment: ${nodeEnv}`);
}

void bootstrap();
