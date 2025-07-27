import { seconds, type ThrottlerModuleOptions } from "@nestjs/throttler";
import type { Request } from "express";

const throttlerModuleOptions: ThrottlerModuleOptions = {
  throttlers: [
    {
      ttl: seconds(60),
      limit: 100,
    },
    {
      name: "mutating",
      ttl: seconds(30),
      limit: 15,
    },
    {
      name: "readonly",
      ttl: seconds(10),
      limit: 150,
    },
  ],
  getTracker: (req: Request) => {
    const deviceId = req.headers["x-device-id"];

    return typeof deviceId === "string" ? deviceId : req.ip || "unknown";
  },
};

export default throttlerModuleOptions;
