import type { ExecutionContext } from "@nestjs/common";
import { seconds, type ThrottlerModuleOptions } from "@nestjs/throttler";
import type { Request } from "express";

const throttlerModuleOptions: ThrottlerModuleOptions = {
  throttlers: [
    {
      ttl: seconds(30),
      limit: 20,
    },
  ],

  skipIf: (context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();

    const freeEndpoints = ["/document-types", "/files"];

    return (
      request.method === "GET" &&
      freeEndpoints.some((endpoint) => request.url.startsWith(endpoint))
    );
  },

  getTracker: (req: Request) => {
    const deviceId = req.headers["x-device-id"];

    return typeof deviceId === "string" ? deviceId : req.ip || "unknown";
  },
};

export default throttlerModuleOptions;
