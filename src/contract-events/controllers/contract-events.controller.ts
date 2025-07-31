import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiParam, ApiQuery } from "@nestjs/swagger";
import { Types } from "mongoose";
import {
  ApiGlobalErrorResponses,
  ApiStandardResponses,
} from "src/common/decorators/routes/docs.decorator";
import { Roles } from "src/common/decorators/routes/roles.decorator";
import { ContractEventResponseDto } from "src/common/dto/response/contract-event.dto";
import { ParseCpfPipe } from "src/common/pipes/parse-cpf.pipe";
import { ParseObjectIdPipeLocal } from "src/common/pipes/parse-objectId-local.pipe";
import { EmployeeRole } from "src/employees/schemas/employee.schema";

import { ContractEventsService } from "../providers/contract-events.service";

@ApiGlobalErrorResponses()
@Roles(EmployeeRole.MANAGER, EmployeeRole.ADMIN)
@Controller("contract-events")
export class ContractEventsController {
  constructor(private readonly contractEventsService: ContractEventsService) {}

  @ApiStandardResponses({
    ok: {
      description: "List of contract events",
      type: ContractEventResponseDto,
      isArray: true,
    },
  })
  @ApiQuery({
    name: "employeeCpf",
    required: false,
    description: "Filter by employee CPF",
    type: String,
  })
  @Get()
  async findAll(
    @Query("employeeCpf", new ParseCpfPipe({ optional: true }))
    employeeCpf?: string,
  ): Promise<ContractEventResponseDto[]> {
    if (employeeCpf) {
      return await this.contractEventsService.findAllByEmployeeCpf(employeeCpf);
    }

    return await this.contractEventsService.findAll();
  }

  @ApiStandardResponses({
    ok: {
      description: "Contract event details",
      type: ContractEventResponseDto,
    },
    notFound: true,
  })
  @ApiParam({
    name: "contractEventId",
    description: "ID of the contract event",
    type: String,
    format: "ObjectId",
  })
  @Get(":contractEventId")
  async findById(
    @Param("contractEventId", new ParseObjectIdPipeLocal())
    contractEventId: Types.ObjectId,
  ): Promise<ContractEventResponseDto> {
    return await this.contractEventsService.findById(contractEventId);
  }
}
