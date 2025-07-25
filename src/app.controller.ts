import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";

import { ApiGlobalErrorResponses } from "./common/decorators/routes/docs";

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

  @Get("temp/a/b/c/:param")
  getTemporary(@Param("param", ParseIntPipe) param: number): any {
    if (param > 2) {
      throw new BadRequestException(
        "This endpoint is temporary and only accepts param values less than or equal to 2.",
      );
    }

    return {
      message: "Temporary endpoint response",
      paramValue: param,
    };
  }
}
