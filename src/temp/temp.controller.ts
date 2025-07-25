import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";

import { TempService } from "./temp.service";

@Controller("temp")
export class TempController {
  constructor(private readonly tempService: TempService) {}

  @Get("a/b/c/:param")
  async getTemporary(
    @Param("param", ParseIntPipe) param: number,
  ): Promise<any> {
    return await this.tempService.getTemporary(param);
  }
}
