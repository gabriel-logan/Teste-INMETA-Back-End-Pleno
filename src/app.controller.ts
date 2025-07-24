import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";

import { ApiInternalServerResponse } from "./common/decorators/routes/docs";

@ApiInternalServerResponse()
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
