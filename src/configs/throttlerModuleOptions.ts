import {
  minutes,
  seconds,
  type ThrottlerModuleOptions,
} from "@nestjs/throttler";
import type { Request } from "express";

const throttlerModuleOptions: ThrottlerModuleOptions = {
  throttlers: [
    {
      ttl: seconds(1),
      limit: 100,
    },
    {
      name: "short",
      ttl: seconds(10),
      limit: 30,
    },
    {
      name: "medium",
      ttl: seconds(30),
      limit: 200,
    },
    {
      name: "long",
      ttl: minutes(1),
      limit: 500,
    },
  ],
  getTracker: (req: Request) => {
    const deviceId = req.headers["x-device-id"];

    if (!deviceId || typeof deviceId !== "string") {
      return req.ip || "unknown-ip";
    }

    return deviceId;
  },
};

export default throttlerModuleOptions;
