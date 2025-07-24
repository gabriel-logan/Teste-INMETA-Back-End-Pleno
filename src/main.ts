import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";

import { AppModule } from "./app.module";
import swaggerInitializer from "./configs/swagger";
import type { EnvGlobalConfig } from "./configs/types";

const logger = new Logger("Bootstrap");

const globalPrefix = "api/v1";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix(globalPrefix);

  const configService = app.get(ConfigService<EnvGlobalConfig, true>);

  const { nodeEnv, baseUrl, port } =
    configService.get<EnvGlobalConfig["server"]>("server");

  // Initialize Swagger
  swaggerInitializer(app, { globalPrefix });

  await app.listen(port);

  logger.log(`Application is running on: ${baseUrl}/${globalPrefix}`);
  logger.log(
    `Access the Swagger documentation at: ${baseUrl}/${globalPrefix}/docs`,
  );
  logger.log(`Environment: ${nodeEnv}`);
}

void bootstrap();
