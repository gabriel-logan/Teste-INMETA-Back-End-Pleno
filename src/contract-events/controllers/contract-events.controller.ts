import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiQuery, ApiSecurity } from "@nestjs/swagger";
import {
  ApiGlobalErrorResponses,
  ApiStandardResponses,
} from "src/common/decorators/routes/docs.decorator";
import { Roles } from "src/common/decorators/routes/roles.decorator";
import { ParseCpfPipe } from "src/common/pipes/parse-cpf.pipe";
import { ParseObjectIdPipeLocal } from "src/common/pipes/parse-objectId-local.pipe";
import { EmployeeRole } from "src/employees/schemas/employee.schema";

import { ContractEventsService } from "../providers/contract-events.service";
import { ContractEvent } from "../schemas/contract-event.schema";

@ApiSecurity("bearer")
@Roles(EmployeeRole.MANAGER, EmployeeRole.ADMIN)
@ApiGlobalErrorResponses()
@Controller("contract-events")
export class ContractEventsController {
  constructor(private readonly contractEventsService: ContractEventsService) {}

  @ApiStandardResponses({
    ok: {
      description: "List of contract events",
      type: ContractEvent,
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
  ): Promise<ContractEvent[]> {
    if (employeeCpf) {
      return await this.contractEventsService.findAllByEmployeeCpf(employeeCpf);
    }

    return await this.contractEventsService.findAll();
  }

  @Get(":contractEventId")
  async findById(
    @Param("contractEventId", new ParseObjectIdPipeLocal())
    contractEventId: string,
  ): Promise<ContractEvent> {
    return await this.contractEventsService.findById(contractEventId);
  }
}
