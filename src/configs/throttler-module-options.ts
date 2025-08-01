import { Logger } from "@nestjs/common";
import type { ThrottlerOptions } from "@nestjs/throttler";
import { seconds } from "@nestjs/throttler";
import { createHash } from "crypto";
import type { Request } from "express";
import { apiPrefix } from "src/common/constants";

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
      const ip = req.ip || "unknown";
      const ua = req.headers["user-agent"] || "unknown";
      const accept = req.headers["accept"] || "";

      const safeIp = ip.length > 45 ? ip.slice(0, 45) : ip; // Max length for IPv6

      try {
        const safeUa = ua.length > 150 ? ua.slice(0, 150) : ua;
        const safeAccept = accept.length > 100 ? accept.slice(0, 100) : accept;

        logger.debug({
          message: "Generating fingerprint for throttling",
          ip: safeIp,
          userAgent: safeUa,
          acceptHeader: safeAccept,
        });

        const fingerprint = createHash("sha1")
          .update(`${safeIp}-${safeUa}-${safeAccept}`)
          .digest("hex");

        logger.debug(`Fingerprint: ${fingerprint}`);

        return fingerprint;
      } catch (error) {
        logger.error("Failed to generate fingerprint", error);
        logger.warn(
          "Using default 'req.ip' format due to fingerprint generation failure",
        );
        return safeIp; // Fallback to IP if fingerprint generation fails
      }
    },
  },
];

export default throttlerModuleOptions;
