import { Logger } from "@nestjs/common";
import type { ThrottlerOptions } from "@nestjs/throttler";
import { seconds } from "@nestjs/throttler";
import type { Request } from "express";
import { apiPrefix } from "src/common/constants";
import {
  parseSafeIp,
  parseSafeUserAgent,
} from "src/common/utils/parse-safe-headers";
import generateTrackerFingerprint from "src/common/utils/tracker-fingerprint";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

const logger = new Logger("ThrottlerModuleOptions");

const throttlerModuleOptions: ThrottlerOptions[] = [
  {
    ttl(context): number {
      const request = context.switchToHttp().getRequest<Request>();
      const method = request.method as Method;

      if (method === "GET") {
        return seconds(25);
      }

      return seconds(15);
    },

    limit(context): number {
      const request = context.switchToHttp().getRequest<Request>();
      const method = request.method as Method;

      if (method === "GET") {
        return 20;
      }

      if (request.url.startsWith(`${apiPrefix}/document-files`)) {
        return 8;
      }

      return 15;
    },

    blockDuration(context): number {
      const request = context.switchToHttp().getRequest<Request>();
      const method = request.method as Method;

      if (method === "GET") {
        return seconds(10);
      }

      return seconds(30);
    },

    skipIf(context): boolean {
      const request = context.switchToHttp().getRequest<Request>();

      const fileEndpoints = [`${apiPrefix}/files`];

      const freeEndpoints = [...fileEndpoints];

      return (
        (request.method as Method) === "GET" &&
        freeEndpoints.some((endpoint) => request.url.startsWith(endpoint))
      );
    },

    getTracker(req: Request): string {
      const ip = parseSafeIp(req.ip);
      const ua = parseSafeUserAgent(req.headers["user-agent"]);

      // Add some logic to handle only valid user agents
      // For this example, I will not use any validation logic,

      try {
        return generateTrackerFingerprint(`${ip}-${ua}`);
      } catch (error) {
        logger.error("Failed to generate fingerprint", error);
        logger.warn(
          "Using default 'req.ip' format due to fingerprint generation failure",
        );
        return ip; // Fallback to IP if fingerprint generation fails
      }
    },
  },
];

export default throttlerModuleOptions;
