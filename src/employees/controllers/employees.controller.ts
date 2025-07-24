import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
} from "@nestjs/swagger";

import { BadRequestExceptionDto } from "../dto/exception/bad-request.dto";
import { InternalServerErrorDto } from "../dto/exception/internal-server-error.dto";
import { NotFoundExceptionDto } from "../dto/exception/not-found.dto";
import { CreateEmployeeRequestDto } from "../dto/request/create-employee.dto";
import { UpdateEmployeeRequestDto } from "../dto/request/update-employee.dto";
import { PublicEmployeeResponseDto } from "../dto/response/public-employee.dto";
import { EmployeesService } from "../providers/employees.service";

@Controller("employees")
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @ApiResponse({
    description: "List of all employees",
    type: [PublicEmployeeResponseDto],
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
    type: InternalServerErrorDto,
  })
  @Get()
  async findAll(): Promise<PublicEmployeeResponseDto[]> {
    return await this.employeesService.findAll();
  }

  @ApiOkResponse({
    description: "Employee details by ID",
    type: PublicEmployeeResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
    type: InternalServerErrorDto,
  })
  @ApiNotFoundResponse({
    description: "Employee not found",
    type: NotFoundExceptionDto,
  })
  @Get(":id")
  async findById(@Param("id") id: string): Promise<PublicEmployeeResponseDto> {
    return await this.employeesService.findById(id);
  }

  @ApiOkResponse({
    description: "Employee details by ID",
    type: PublicEmployeeResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
    type: InternalServerErrorDto,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: BadRequestExceptionDto,
  })
  @Post()
  async create(
    @Body() createEmployeeRequestDto: CreateEmployeeRequestDto,
  ): Promise<PublicEmployeeResponseDto> {
    return await this.employeesService.create(createEmployeeRequestDto);
  }

  @ApiOkResponse({
    description: "Employee details by ID",
    type: PublicEmployeeResponseDto,
  })
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateEmployeeRequestDto: UpdateEmployeeRequestDto,
  ): Promise<PublicEmployeeResponseDto> {
    return await this.employeesService.update(id, updateEmployeeRequestDto);
  }

  @ApiOkResponse({
    description: "Employee details by ID",
    type: PublicEmployeeResponseDto,
  })
  @Delete(":id")
  async delete(@Param("id") id: string): Promise<PublicEmployeeResponseDto> {
    return await this.employeesService.delete(id);
  }
}
