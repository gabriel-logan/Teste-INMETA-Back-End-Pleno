import type { ExecutionContext } from "@nestjs/common";
import { seconds, type ThrottlerModuleOptions } from "@nestjs/throttler";
import type { Request } from "express";

const throttlerModuleOptions: ThrottlerModuleOptions = {
  throttlers: [
    {
      ttl: seconds(30),
      limit: 25,
      blockDuration: (context: ExecutionContext): number => {
        const request = context.switchToHttp().getRequest<Request>();
        const method = request.method;

        if (method === "POST") {
          return seconds(10);
        }

        return seconds(30);
      },
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
