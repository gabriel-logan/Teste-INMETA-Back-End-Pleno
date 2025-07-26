import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { CreateContractEventDto } from "../dto/request/create-contract-event.dto";
import { UpdateContractEventDto } from "../dto/request/update-contract-event.dto";
import { ContractEventsService } from "../providers/contract-events.service";

@Controller("contract-events")
export class ContractEventsController {
  constructor(private readonly contractEventsService: ContractEventsService) {}

  @Post()
  create(@Body() createContractEventDto: CreateContractEventDto) {
    return this.contractEventsService.create(createContractEventDto);
  }

  @Get()
  findAll() {
    return this.contractEventsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.contractEventsService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateContractEventDto: UpdateContractEventDto,
  ) {
    return this.contractEventsService.update(+id, updateContractEventDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.contractEventsService.remove(+id);
  }
}
