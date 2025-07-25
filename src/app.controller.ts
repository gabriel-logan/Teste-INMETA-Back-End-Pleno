import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";

import { AppService } from "./app.service";
import { ApiGlobalErrorResponses } from "./common/decorators/routes/docs";

@ApiGlobalErrorResponses()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
    return this.appService.getTemporary(param);
  }
}
