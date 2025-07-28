import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";

import { AppModule } from "./app.module";
import { apiPrefix } from "./common/constants";
import { MongodbExceptionFilter } from "./common/filters/mongodb-exception.filter";
import swaggerInitializer from "./configs/swagger";
import type { EnvGlobalConfig } from "./configs/types";

const logger = new Logger("Bootstrap");

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix(apiPrefix);

  const configService = app.get(ConfigService<EnvGlobalConfig, true>);

  const { nodeEnv, baseUrl, port } =
    configService.get<EnvGlobalConfig["server"]>("server");

  if (nodeEnv === "production") {
    app.use(helmet());

    // Trust proxy headers in production for correct request IPs
    // Setting "true" only for VERCEL deployments
    // If you are using a different hosting provider, adjust accordingly
    // For example, Nginx via reverse proxy, you might use "loopback" and configure it in Nginx
    // To override the header to the real client IP
    app.set("trust proxy", true);
  }

  app.useGlobalFilters(new MongodbExceptionFilter());

  app.useGlobalPipes(new ValidationPipe());

  // Initialize Swagger
  swaggerInitializer(app, { globalPrefix: apiPrefix });

  await app.listen(port);

  logger.log(`Application is running on: ${baseUrl}${apiPrefix}`);
  logger.log(
    `Access the Swagger documentation at: ${baseUrl}${apiPrefix}/docs`,
  );
  logger.log(`Environment: ${nodeEnv}`);
}

void bootstrap();
