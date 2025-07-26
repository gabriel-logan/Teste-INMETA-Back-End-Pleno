import { Module } from "@nestjs/common";

import { ContractEventsController } from "./controllers/contract-events.controller";
import { ContractEventsService } from "./providers/contract-events.service";

@Module({
  controllers: [ContractEventsController],
  providers: [ContractEventsService],
})
export class ContractEventsModule {}
