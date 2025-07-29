import type { ThrottlerModuleOptions } from "@nestjs/throttler";
import { seconds } from "@nestjs/throttler";
import type { Request } from "express";
import { apiPrefix } from "src/common/constants";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

const throttlerModuleOptions: ThrottlerModuleOptions = [
  {
    ttl(context): number {
      const request = context.switchToHttp().getRequest<Request>();
      const method = request.method as Method;

      if (method === "GET") {
        return seconds(25);
      }

      return seconds(15);
    },

    limit: 20,

    blockDuration: (context): number => {
      const request = context.switchToHttp().getRequest<Request>();
      const method = request.method as Method;

      if (method === "GET") {
        return seconds(10);
      }

      return seconds(30);
    },

    skipIf: (context): boolean => {
      const request = context.switchToHttp().getRequest<Request>();

      const cachedEndpoints = [`${apiPrefix}/document-types`];
      const fileEndpoints = [`${apiPrefix}/files`];

      const freeEndpoints = [...cachedEndpoints, ...fileEndpoints];

      const method = request.method as Method;

      return (
        method === "GET" &&
        freeEndpoints.some((endpoint) => request.url.startsWith(endpoint))
      );
    },

    getTracker: (req: Request): string => {
      const deviceId = req.headers["x-device-id"];

      return typeof deviceId === "string" ? deviceId : req.ip || "unknown";
    },
  },
];

export default throttlerModuleOptions;
