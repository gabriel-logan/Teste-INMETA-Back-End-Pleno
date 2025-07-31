import type { NestExpressApplication } from "@nestjs/platform-express";
import type { OpenAPIObject } from "@nestjs/swagger";
import { SwaggerModule } from "@nestjs/swagger";

import swaggerInitializer, { operationsSorter } from "../swagger";

describe("swaggerInitializer", () => {
  let app: NestExpressApplication;
  let setupSpy: jest.SpyInstance;
  let createDocumentSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    app = {} as NestExpressApplication;
    setupSpy = jest.spyOn(SwaggerModule, "setup").mockImplementation();
    createDocumentSpy = jest
      .spyOn(SwaggerModule, "createDocument")
      .mockReturnValue({} as never);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should be defined", () => {
    expect(swaggerInitializer).toBeDefined();
  });

  it("should call SwaggerModule.setup with correct arguments", () => {
    swaggerInitializer(app);

    // Manually trigger documentFactory
    const documentFactory = (
      setupSpy.mock.calls[0] as any[]
    )[2] as () => OpenAPIObject;

    documentFactory();

    expect(createDocumentSpy).toHaveBeenCalledWith(
      app,
      expect.objectContaining({
        info: expect.objectContaining({
          title: "API V1 Server",
          description: "The API V1 Server description",
          version: "1.0.0",
        }) as OpenAPIObject["info"],
      }),
    );

    expect(setupSpy).toHaveBeenCalledWith(
      "/api/v1/docs",
      app,
      expect.any(Function),
      expect.objectContaining({
        customSiteTitle: "API V1 Server Documentation",
        customCss: expect.stringContaining(".swagger-ui") as string,
        swaggerOptions: expect.objectContaining({
          operationsSorter: expect.any(Function) as object,
        }) as unknown as OpenAPIObject["components"],
      }),
    );
  });

  it("should generate OpenAPIObject using documentFactory", () => {
    swaggerInitializer(app);

    // Get the documentFactory function from the call
    const documentFactory = (
      setupSpy.mock.calls[0] as any[]
    )[2] as () => OpenAPIObject;

    const doc = documentFactory();
    expect(createDocumentSpy).toHaveBeenCalled();
    expect(doc).toEqual({});
  });
});

describe("operationsSorter", () => {
  it("should be defined", () => {
    expect(operationsSorter).toBeDefined();
  });

  it("should sort methods according to methodOrder", () => {
    const getParam = (
      method: string,
    ): {
      get: (type: string) => string;
    } => ({
      get: (type: string) => (type === "method" ? method : ""),
    });

    const methods = ["get", "post", "patch", "put", "delete"];
    for (let i = 0; i < methods.length - 1; i++) {
      const a = getParam(methods[i]);
      const b = getParam(methods[i + 1]);
      expect(operationsSorter(a, b)).toBeLessThan(0);
      expect(operationsSorter(b, a /** nosonar */)).toBeGreaterThan(0);
    }
  });

  it("should return 0 for same method", () => {
    const getParam = (
      method: string,
    ): {
      get: (type: string) => string;
    } => ({
      get: (type: string) => (type === "method" ? method : ""),
    });
    expect(operationsSorter(getParam("get"), getParam("get"))).toBe(0);
  });
});
