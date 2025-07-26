import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { ContractEventsService } from "./providers/contract-events.service";
import {
  ContractEvent,
  ContractEventSchema,
} from "./schemas/contract-event.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ContractEvent.name,
        schema: ContractEventSchema,
      },
    ]),
  ],
  providers: [ContractEventsService],
  exports: [ContractEventsService],
})
export class ContractEventsModule {}
