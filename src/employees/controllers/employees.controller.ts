import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiParam, ApiSecurity } from "@nestjs/swagger";
import { Types } from "mongoose";
import {
  ApiGetAllEmployeesQueries,
  ApiGlobalErrorResponses,
  ApiStandardResponses,
} from "src/common/decorators/routes/docs.decorator";
import { Roles } from "src/common/decorators/routes/roles.decorator";
import {
  EmployeeFullResponseDto,
  EmployeeWithContractEventsResponseDto,
  EmployeeWithDocumentTypesResponseDto,
} from "src/common/dto/response/employee.dto";
import { ParseCpfPipe } from "src/common/pipes/parse-cpf.pipe";
import { ParseObjectIdPipeLocal } from "src/common/pipes/parse-objectId-local.pipe";

import { CreateEmployeeRequestDto } from "../dto/request/create-employee.dto";
import { UpdateEmployeeRequestDto } from "../dto/request/update-employee.dto";
import { UpdateEmployeePasswordRequestDto } from "../dto/request/update-employee-password.dto";
import { UpdateEmployeePasswordResponseDto } from "../dto/response/update-employee-password.dto";
import { EmployeesService } from "../providers/employees.service";
import { ContractStatus, EmployeeRole } from "../schemas/employee.schema";

@ApiSecurity("bearer")
@ApiGlobalErrorResponses()
@Roles(EmployeeRole.MANAGER, EmployeeRole.ADMIN)
@Controller("employees")
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @ApiStandardResponses({
    ok: {
      description: "List of all employees",
      type: EmployeeWithDocumentTypesResponseDto,
      isArray: true,
    },
  })
  @ApiGetAllEmployeesQueries()
  @Get()
  async findAllWithDocumentTypes(
    @Query("byFirstName") byFirstName?: string,
    @Query("byLastName") byLastName?: string,
    @Query("byContractStatus") byContractStatus?: ContractStatus,
    @Query("byDocumentTypeId", new ParseObjectIdPipeLocal({ optional: true }))
    byDocumentTypeId?: Types.ObjectId,
    @Query("byCpf", new ParseCpfPipe({ optional: true })) byCpf?: string,
  ): Promise<EmployeeWithDocumentTypesResponseDto[]> {
    return await this.employeesService.findAllWithDocumentTypes({
      byFirstName,
      byLastName,
      byContractStatus,
      byDocumentTypeId,
      byCpf,
    });
  }

  @ApiStandardResponses({
    ok: {
      description: "Employee details by ID",
      type: EmployeeWithDocumentTypesResponseDto,
    },
    notFound: true,
  })
  @ApiParam({
    name: "employeeId",
    description: "ID of the employee",
    type: String,
  })
  @Get(":employeeId")
  async findByIdWithDocumentTypes(
    @Param("employeeId", new ParseObjectIdPipeLocal())
    employeeId: Types.ObjectId,
  ): Promise<EmployeeWithDocumentTypesResponseDto> {
    return await this.employeesService.findByIdWithDocumentTypes(employeeId);
  }

  @ApiStandardResponses({
    ok: {
      description: "Employee details with contract events",
      type: EmployeeWithContractEventsResponseDto,
    },
    notFound: true,
  })
  @ApiParam({
    name: "employeeId",
    description: "ID of the employee",
    type: String,
  })
  @Get(":employeeId/contract-events")
  async findByIdWithContractEvents(
    @Param("employeeId", new ParseObjectIdPipeLocal())
    employeeId: Types.ObjectId,
  ): Promise<EmployeeWithContractEventsResponseDto> {
    return await this.employeesService.findByIdWithContractEvents(employeeId);
  }

  @ApiStandardResponses({
    ok: {
      description: "Create a new employee",
      type: EmployeeFullResponseDto,
      isStatusCodeCreated: true,
    },
    badRequest: true,
    conflict: true,
  })
  @Post()
  async create(
    @Body() createEmployeeDto: CreateEmployeeRequestDto,
  ): Promise<EmployeeFullResponseDto> {
    return await this.employeesService.create(createEmployeeDto);
  }

  @ApiStandardResponses({
    ok: {
      description: "Update employee details",
      type: EmployeeWithDocumentTypesResponseDto,
    },
    notFound: true,
    badRequest: true,
    conflict: true,
  })
  @ApiParam({
    name: "employeeId",
    description: "ID of the employee",
    type: String,
  })
  @Patch(":employeeId")
  async update(
    @Param("employeeId", new ParseObjectIdPipeLocal())
    employeeId: Types.ObjectId,
    @Body() updateEmployeeDto: UpdateEmployeeRequestDto,
  ): Promise<EmployeeWithDocumentTypesResponseDto> {
    return await this.employeesService.update(employeeId, updateEmployeeDto);
  }

  @ApiStandardResponses({
    ok: {
      description: "Update employee password",
      type: UpdateEmployeePasswordResponseDto,
    },
    notFound: true,
    badRequest: true,
  })
  @ApiParam({
    name: "employeeId",
    description: "ID of the employee",
    type: String,
  })
  @Patch(":employeeId/password")
  async updatePassword(
    @Param("employeeId", new ParseObjectIdPipeLocal())
    employeeId: Types.ObjectId,
    @Body() updateEmployeePasswordRequestDto: UpdateEmployeePasswordRequestDto,
  ): Promise<UpdateEmployeePasswordResponseDto> {
    return await this.employeesService.updatePassword(
      employeeId,
      updateEmployeePasswordRequestDto,
    );
  }
}
