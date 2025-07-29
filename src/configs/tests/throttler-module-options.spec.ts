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
  getTracker: (req: Request) => string;
}

describe("throttlerModuleOptions", () => {
  let options: Options;
  let mockContext: ExecutionContext;

  beforeEach(() => {
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
          getRequest: () => ({ method: "GET" }) as Request,
        }) as HttpArgumentsHost;

      const result = options.ttl(mockContext) as unknown as number;

      expect(result).toBe(seconds(25));
    });

    it("returns 15 seconds for non-GET requests", () => {
      mockContext.switchToHttp = (): HttpArgumentsHost =>
        ({
          getRequest: () => ({ method: "POST" }) as Request,
        }) as HttpArgumentsHost;

      const result = options.ttl(mockContext) as unknown as number;

      expect(result).toBe(seconds(15));
    });
  });
});
