import { Module } from "@nestjs/common";

import { TempController } from "./temp.controller";
import { TempService } from "./temp.service";

@Module({
  controllers: [TempController],
  providers: [TempService],
})
export class TempModule {}
