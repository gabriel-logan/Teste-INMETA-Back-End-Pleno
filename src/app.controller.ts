import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";

import { ApiGlobalErrorResponses } from "./common/decorators/routes/docs.decorator";

@ApiGlobalErrorResponses()
@Controller()
export class AppController {
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
  getHello(): string {
    return "Hello World!";
  }
}
