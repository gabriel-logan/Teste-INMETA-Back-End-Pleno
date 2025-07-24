import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";

import { ApiGlobalErrorResponses } from "./common/decorators/routes/docs";

@ApiGlobalErrorResponses()
@Controller()
export class AppController {
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful response",
  })
  @Get()
  getHello(): string {
    return "Hello World!";
  }
}
