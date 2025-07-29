import type { ExecutionContext } from "@nestjs/common";
import type { HttpArgumentsHost } from "@nestjs/common/interfaces";
import { seconds } from "@nestjs/throttler";
import type { Request } from "express";
import { apiPrefix } from "src/common/constants";

import throttlerModuleOptions from "../throttler-module-options";

interface Options {
  ttl: (context: ExecutionContext) => number;
  limit: number;
  blockDuration: (context: ExecutionContext) => number;
  skipIf: (context: ExecutionContext) => boolean;
  getTracker: (req: Request, context?: ExecutionContext) => string;
}

describe("throttlerModuleOptions", () => {
  let options: Options;
  let mockContext: ExecutionContext;

  beforeEach(() => {
    jest.clearAllMocks();

    options = throttlerModuleOptions[0] as Options;
    mockContext = {
      switchToHttp: (): HttpArgumentsHost =>
        ({
          getRequest: (req: Request) => ({
            method: req.method,
            url: req.url,
            headers: req.headers,
            ip: req.ip,
          }),
        }) as unknown as HttpArgumentsHost,
    } as ExecutionContext;
  });

  it("should be defined", () => {
    expect(throttlerModuleOptions).toBeDefined();
  });

  describe("ttl", () => {
    it("returns 25 seconds for GET requests", () => {
      mockContext.switchToHttp = (): HttpArgumentsHost =>
        ({
          getRequest: () => ({ method: "GET" }),
        }) as HttpArgumentsHost;

      const result = options.ttl(mockContext);

      expect(result).toBe(seconds(25));
    });

    it("returns 15 seconds for non-GET requests", () => {
      mockContext.switchToHttp = (): HttpArgumentsHost =>
        ({
          getRequest: () => ({ method: "POST" }),
        }) as HttpArgumentsHost;

      const result = options.ttl(mockContext);

      expect(result).toBe(seconds(15));
    });
  });
  describe("blockDuration", () => {
    it("returns 10 seconds for GET requests", () => {
      mockContext.switchToHttp = (): HttpArgumentsHost =>
        ({
          getRequest: () => ({ method: "GET" }),
        }) as HttpArgumentsHost;

      const result = options.blockDuration(mockContext);

      expect(result).toBe(seconds(10));
    });

    it("returns 30 seconds for non-GET requests", () => {
      mockContext.switchToHttp = (): HttpArgumentsHost =>
        ({
          getRequest: () => ({ method: "POST" }),
        }) as HttpArgumentsHost;

      const result = options.blockDuration(mockContext);

      expect(result).toBe(seconds(30));
    });
  });

  describe("skipIf", () => {
    it("returns true for GET requests to cached endpoints", () => {
      mockContext.switchToHttp = (): HttpArgumentsHost =>
        ({
          getRequest: () =>
            ({
              method: "GET",
              url: `${apiPrefix}/document-types/123`,
            }) as Request,
        }) as HttpArgumentsHost;

      const result = options.skipIf(mockContext);

      expect(result).toBe(true);
    });

    it("returns true for GET requests to file endpoints", () => {
      mockContext.switchToHttp = (): HttpArgumentsHost =>
        ({
          getRequest: () =>
            ({
              method: "GET",
              url: `${apiPrefix}/files/abc`,
            }) as Request,
        }) as HttpArgumentsHost;

      const result = options.skipIf(mockContext);

      expect(result).toBe(true);
    });

    it("returns false for GET requests to other endpoints", () => {
      mockContext.switchToHttp = (): HttpArgumentsHost =>
        ({
          getRequest: () =>
            ({
              method: "GET",
              url: `${apiPrefix}/other-endpoint`,
            }) as Request,
        }) as HttpArgumentsHost;

      const result = options.skipIf(mockContext);

      expect(result).toBe(false);
    });

    it("returns false for non-GET requests to free endpoints", () => {
      mockContext.switchToHttp = (): HttpArgumentsHost =>
        ({
          getRequest: () =>
            ({
              method: "POST",
              url: `${apiPrefix}/document-types`,
            }) as Request,
        }) as HttpArgumentsHost;

      const result = options.skipIf(mockContext);

      expect(result).toBe(false);
    });
  });

  describe("getTracker", () => {
    it("returns x-device-id header if present", () => {
      const req = {
        headers: { "x-device-id": "device-123" },
        ip: "1.2.3.4",
      } as unknown as Request;

      const result = options.getTracker(req);

      expect(result).toBe("device-123");
    });

    it("returns req.ip if x-device-id header is not present", () => {
      const req = {
        headers: {},
        ip: "5.6.7.8",
      } as Request;

      const result = options.getTracker(req);

      expect(result).toBe("5.6.7.8");
    });

    it("returns 'unknown' if neither x-device-id nor ip is present", () => {
      const req = {
        headers: {},
        ip: undefined,
      } as unknown as Request;

      const result = options.getTracker(req);

      expect(result).toBe("unknown");
    });
  });

  it("should have limit set to 20", () => {
    expect(options.limit).toBe(20);
  });
});
