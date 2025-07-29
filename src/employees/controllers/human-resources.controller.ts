import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";
import { ApiParam, ApiSecurity } from "@nestjs/swagger";
import { Types } from "mongoose";
import {
  ApiGlobalErrorResponses,
  ApiStandardResponses,
} from "src/common/decorators/routes/docs.decorator";
import { EmployeeFromReq } from "src/common/decorators/routes/employee.decorator";
import { Roles } from "src/common/decorators/routes/roles.decorator";
import { ParseObjectIdPipeLocal } from "src/common/pipes/parse-objectId-local.pipe";
import { AuthPayload } from "src/common/types";

import {
  FireEmployeeRequestDto,
  ReHireEmployeeRequestDto,
} from "../dto/request/action-reason-employee.dto";
import {
  FireEmployeeResponseDto,
  ReHireEmployeeResponseDto,
} from "../dto/response/action-reason-employee.dto";
import { HumanResourcesService } from "../providers/human-resources.service";
import { EmployeeRole } from "../schemas/employee.schema";

@ApiSecurity("bearer")
@ApiGlobalErrorResponses()
@Roles(EmployeeRole.MANAGER, EmployeeRole.ADMIN)
@Controller("human-resources")
export class HumanResourcesController {
  constructor(private readonly humanResourcesService: HumanResourcesService) {}

  @ApiStandardResponses({
    ok: {
      description: "Fire an employee",
      type: FireEmployeeResponseDto,
    },
    notFound: true,
    badRequest: true,
  })
  @ApiParam({
    name: "employeeId",
    description: "ID of the employee",
    type: String,
  })
  @HttpCode(HttpStatus.OK)
  @Post("fire/:employeeId")
  async fire(
    @Param("employeeId", new ParseObjectIdPipeLocal())
    employeeId: Types.ObjectId,
    @Body() fireEmployeeDto: FireEmployeeRequestDto,
    @EmployeeFromReq() employeeFromReq: AuthPayload,
  ): Promise<FireEmployeeResponseDto> {
    return await this.humanResourcesService.fire(
      employeeId,
      fireEmployeeDto,
      employeeFromReq,
    );
  }

  @ApiStandardResponses({
    ok: {
      description: "Rehire an employee",
      type: ReHireEmployeeResponseDto,
    },
    notFound: true,
    badRequest: true,
  })
  @ApiParam({
    name: "employeeId",
    description: "ID of the employee",
    type: String,
  })
  @HttpCode(HttpStatus.OK)
  @Post("rehire/:employeeId")
  async reHire(
    @Param("employeeId", new ParseObjectIdPipeLocal())
    employeeId: Types.ObjectId,
    @Body() reHireEmployeeDto: ReHireEmployeeRequestDto,
    @EmployeeFromReq() employeeFromReq: AuthPayload,
  ): Promise<ReHireEmployeeResponseDto> {
    return await this.humanResourcesService.reHire(
      employeeId,
      reHireEmployeeDto,
      employeeFromReq,
    );
  }
}
