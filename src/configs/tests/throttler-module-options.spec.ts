/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { ExecutionContext } from "@nestjs/common";
import type { Request } from "express";
import { apiPrefix } from "src/common/constants";

import throttlerModuleOptions from "../throttler-module-options";

const createMockContext = (method: string, url: string): ExecutionContext => {
  const req: Partial<Request> = {
    method,
    url,
    headers: {},
    ip: "127.0.0.1",
  };

  return {
    switchToHttp: () => ({
      getRequest: () => req,
    }),
  } as unknown as ExecutionContext;
};

describe("throttlerModuleOptions", () => {
  const [throttler] = throttlerModuleOptions.throttlers;

  it("should return correct ttl for GET", () => {
    const context = createMockContext("GET", "/");
    const ttl = throttler.ttl(context);
    expect(ttl).toBe(25);
  });

  it("should return correct ttl for POST", () => {
    const context = createMockContext("POST", "/");
    const ttl = throttler.ttl(context);
    expect(ttl).toBe(15);
  });

  it("should return correct blockDuration for GET", () => {
    const context = createMockContext("GET", "/");
    const duration = throttler.blockDuration(context);
    expect(duration).toBe(10);
  });

  it("should return correct blockDuration for POST", () => {
    const context = createMockContext("POST", "/");
    const duration = throttler.blockDuration(context);
    expect(duration).toBe(30);
  });

  it("should skip throttling for allowed GET endpoint", () => {
    const context = createMockContext("GET", `${apiPrefix}/files/something`);
    const result = throttlerModuleOptions.skipIf(context);
    expect(result).toBe(true);
  });

  it("should not skip throttling for non-free GET endpoint", () => {
    const context = createMockContext("GET", "/api/users");
    const result = throttlerModuleOptions.skipIf(context);
    expect(result).toBe(false);
  });

  it("should return device ID from header", () => {
    const req = {
      headers: { "x-device-id": "abc123" },
      ip: "1.1.1.1",
    } as Request;

    const tracker = throttlerModuleOptions.getTracker(req);
    expect(tracker).toBe("abc123");
  });

  it("should fallback to IP if no device ID", () => {
    const req = {
      headers: {},
      ip: "1.1.1.1",
    } as Request;

    const tracker = throttlerModuleOptions.getTracker(req);
    expect(tracker).toBe("1.1.1.1");
  });

  it("should fallback to 'unknown' if no device ID or IP", () => {
    const req = {
      headers: {},
    } as Request;

    const tracker = throttlerModuleOptions.getTracker(req);
    expect(tracker).toBe("unknown");
  });
});
