import type { ExecutionContext } from "@nestjs/common";
import { seconds, type ThrottlerModuleOptions } from "@nestjs/throttler";
import type { Request } from "express";
import { apiPrefix } from "src/common/constants";

const throttlerModuleOptions: ThrottlerModuleOptions = {
  throttlers: [
    {
      ttl: seconds(25),
      limit: 20,
      blockDuration: (context: ExecutionContext): number => {
        const request = context.switchToHttp().getRequest<Request>();
        const method = request.method;

        if (method === "GET") {
          return seconds(10);
        }

        return seconds(30);
      },
    },
  ],

  skipIf: (context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();

    const freeEndpoints = [`${apiPrefix}/document-types`, `${apiPrefix}/files`];

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
