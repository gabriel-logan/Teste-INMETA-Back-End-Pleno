import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import {
  ApiInternalServerResponse,
  ApiStandardResponses,
} from "src/common/decorators/routes/docs";

import { CreateEmployeeRequestDto } from "../dto/request/create-employee.dto";
import { UpdateEmployeeRequestDto } from "../dto/request/update-employee.dto";
import { PublicEmployeeResponseDto } from "../dto/response/public-employee.dto";
import { EmployeesService } from "../providers/employees.service";

@ApiInternalServerResponse()
@Controller("employees")
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @ApiResponse({
    description: "List of employees",
    type: [PublicEmployeeResponseDto],
  })
  @Get()
  async findAll(): Promise<PublicEmployeeResponseDto[]> {
    return await this.employeesService.findAll();
  }

  @ApiStandardResponses({
    ok: {
      description: "Employee details by ID",
      type: PublicEmployeeResponseDto,
    },
    notFound: true,
  })
  @Get(":id")
  async findById(@Param("id") id: string): Promise<PublicEmployeeResponseDto> {
    return await this.employeesService.findById(id);
  }

  @ApiStandardResponses({
    ok: {
      description: "Create a new employee",
      type: PublicEmployeeResponseDto,
    },
    badRequest: true,
  })
  @Post()
  async create(
    @Body() createEmployeeRequestDto: CreateEmployeeRequestDto,
  ): Promise<PublicEmployeeResponseDto> {
    return await this.employeesService.create(createEmployeeRequestDto);
  }

  @ApiStandardResponses({
    ok: {
      description: "Update employee details",
      type: PublicEmployeeResponseDto,
    },
    notFound: true,
    badRequest: true,
  })
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateEmployeeRequestDto: UpdateEmployeeRequestDto,
  ): Promise<PublicEmployeeResponseDto> {
    return await this.employeesService.update(id, updateEmployeeRequestDto);
  }

  @ApiStandardResponses({
    ok: {
      description: "Delete an employee",
      type: PublicEmployeeResponseDto,
    },
    notFound: true,
  })
  @Delete(":id")
  async delete(@Param("id") id: string): Promise<PublicEmployeeResponseDto> {
    return await this.employeesService.delete(id);
  }
}
