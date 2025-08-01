import { Controller, Get, HttpStatus, Logger, Req } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import type { Request } from "express";

import { ApiGlobalErrorResponses } from "./common/decorators/routes/docs.decorator";
import { Public } from "./common/decorators/routes/public.decorator";

@Public()
@ApiGlobalErrorResponses()
@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful response",
    schema: {
      type: "string",
      example: "Hello World!",
      readOnly: true,
    },
  })
  @Get()
  getHello(@Req() req: Request): string {
    const ip = req.ip || "unknown";
    const ua = req.headers["user-agent"] || "unknown";
    const accept = req.headers["accept"] || "";

    const safeIp = ip.length > 45 ? ip.slice(0, 45) : ip; // Max length for IPv6
    const safeUa = ua.length > 300 ? ua.slice(0, 300) : ua;
    const safeAccept = accept.length > 300 ? accept.slice(0, 300) : accept;

    this.logger.debug({
      message: "Request received",
      ip: safeIp,
      userAgent: safeUa,
      acceptHeader: safeAccept,
    });

    return "Hello World!";
  }
}
