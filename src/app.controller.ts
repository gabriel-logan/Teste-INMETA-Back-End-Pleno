import { Controller, Get, HttpStatus, Logger, Req } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import type { Request } from "express";

import { ApiGlobalErrorResponses } from "./common/decorators/routes/docs.decorator";
import { Public } from "./common/decorators/routes/public.decorator";
import {
  parseSafeAcceptHeader,
  parseSafeIp,
  parseSafeUserAgent,
} from "./common/utils/parse-safe-headers";

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
    const ip = parseSafeIp(req.ip);
    const ua = parseSafeUserAgent(req.headers["user-agent"]);
    const accept = parseSafeAcceptHeader(req.headers["accept"]);

    this.logger.debug({
      message: "Request received",
      ip,
      userAgent: ua,
      acceptHeader: accept,
    });

    return "Hello World!";
  }
}
