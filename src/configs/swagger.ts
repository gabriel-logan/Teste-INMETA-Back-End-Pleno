import type { NestExpressApplication } from "@nestjs/platform-express";
import type { OpenAPIObject } from "@nestjs/swagger";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

type OperationsSorterParam = {
  get: (type: string) => string;
};

export function operationsSorter(
  a: OperationsSorterParam,
  b: OperationsSorterParam,
): number {
  const methodOrder = ["get", "post", "patch", "put", "delete"];
  const methodA = methodOrder.indexOf(a.get("method").toLowerCase());
  const methodB = methodOrder.indexOf(b.get("method").toLowerCase());
  return methodA - methodB;
}

const config = new DocumentBuilder()
  .setTitle("API V1 Server")
  .setDescription("The API V1 Server description")
  .setVersion("1.0.0")
  .addBearerAuth()
  .addSecurityRequirements("bearer")
  .build();

export default function swaggerInitializer(
  app: NestExpressApplication,
  configs: { globalPrefix: string },
): void {
  function documentFactory(): OpenAPIObject {
    return SwaggerModule.createDocument(app, config);
  }

  SwaggerModule.setup(`${configs.globalPrefix}/docs`, app, documentFactory, {
    customSiteTitle: "API V1 Server Documentation",
    customCss: `.swagger-ui .opblock.opblock-patch .opblock-summary-method { background:#d1bd21; }`,
    swaggerOptions: {
      operationsSorter,
    },
  });
}
