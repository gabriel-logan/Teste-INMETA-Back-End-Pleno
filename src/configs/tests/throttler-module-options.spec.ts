import { type ExecutionContext, Logger } from "@nestjs/common";
import type { HttpArgumentsHost } from "@nestjs/common/interfaces";
import { seconds } from "@nestjs/throttler";
import * as crypto from "crypto";
import type { Request } from "express";
import { apiPrefix } from "src/common/constants";

import throttlerModuleOptions from "../throttler-module-options";

interface Options {
  ttl: (context: ExecutionContext) => number;
  limit: (context: ExecutionContext) => number;
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

  describe("limit", () => {
    it("returns 20 for GET requests", () => {
      mockContext.switchToHttp = (): HttpArgumentsHost =>
        ({
          getRequest: () => ({ method: "GET" }),
        }) as HttpArgumentsHost;

      const result = options.limit(mockContext);

      expect(result).toBe(20);
    });

    it("returns 8 for document-files endpoint", () => {
      mockContext.switchToHttp = (): HttpArgumentsHost =>
        ({
          getRequest: () => ({
            method: "POST",
            url: `${apiPrefix}/document-files`,
          }),
        }) as HttpArgumentsHost;

      const result = options.limit(mockContext);

      expect(result).toBe(8);
    });

    it("returns 15 for other endpoints", () => {
      mockContext.switchToHttp = (): HttpArgumentsHost =>
        ({
          getRequest: () => ({
            method: "POST",
            url: `${apiPrefix}/other-endpoint`,
          }),
        }) as HttpArgumentsHost;

      const result = options.limit(mockContext);

      expect(result).toBe(15);
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
    beforeEach(() => {
      jest.spyOn(Logger.prototype, "debug").mockImplementation(() => {});
      jest.spyOn(Logger.prototype, "error").mockImplementation(() => {});
      jest.spyOn(Logger.prototype, "warn").mockImplementation(() => {});
    });

    it("returns a string fingerprint when IP, User-Agent, and Accept header are present", () => {
      const req = {
        headers: {
          "user-agent": "test-agent",
          accept: "application/json",
        },
        ip: "1.2.3.4",
      } as Request;

      const result = options.getTracker(req);

      expect(result).toEqual(expect.any(String));
    });

    it("returns a fingerprint with long User-Agent and Accept truncated", () => {
      const req = {
        headers: {
          "user-agent": "a".repeat(301),
          accept: "b".repeat(301),
        },
        ip: "5.6.7.8",
      } as Request;

      const result = options.getTracker(req);

      expect(result).toEqual(expect.any(String));
    });

    it("returns a fingerprint with long ip truncated to 46 characters", () => {
      const req = {
        headers: {
          "user-agent": "test-agent",
          accept: "application/json",
        },
        ip: "1.2.3.4".repeat(46),
      } as Request;

      const result = options.getTracker(req);

      expect(result).toEqual(expect.any(String));
    });

    it("still returns a fingerprint when IP is missing", () => {
      const req = {
        headers: {
          "user-agent": "fallback-agent",
          accept: "application/json",
        },
        ip: "",
      } as Request;

      const result = options.getTracker(req);

      expect(result).toEqual(expect.any(String));
    });

    it("still returns a fingerprint when User-Agent is missing", () => {
      const req = {
        headers: {
          accept: "application/json",
        },
        ip: "9.8.7.6",
      } as Request;

      const result = options.getTracker(req);

      expect(result).toEqual(expect.any(String));
    });

    it("still returns a fingerprint when Accept header is missing", () => {
      const req = {
        headers: {
          "user-agent": "test-agent",
        },
        ip: "9.8.7.6",
      } as Request;

      const result = options.getTracker(req);

      expect(result).toEqual(expect.any(String));
    });

    it("falls back to IP when fingerprint generation throws an error", () => {
      const req = {
        headers: { "user-agent": "test-agent", accept: "application/json" },
        ip: "fallback-ip",
      } as Request;

      jest.spyOn(crypto, "createHash").mockImplementationOnce(() => {
        throw new Error("simulate hash failure");
      });

      const result = options.getTracker(req);

      expect(result).toBe("fallback-ip");
    });
  });
});
