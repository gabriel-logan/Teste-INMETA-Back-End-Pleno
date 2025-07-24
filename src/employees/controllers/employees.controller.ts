import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiInternalServerErrorResponse } from "@nestjs/swagger";

import {
  ApiCreateEmployee,
  ApiDeleteEmployee,
  ApiFindAll,
  ApiFindById,
  ApiUpdateEmployee,
} from "../decorators/docs";
import { InternalServerErrorDto } from "../dto/exception/internal-server-error.dto";
import { CreateEmployeeRequestDto } from "../dto/request/create-employee.dto";
import { UpdateEmployeeRequestDto } from "../dto/request/update-employee.dto";
import { PublicEmployeeResponseDto } from "../dto/response/public-employee.dto";
import { EmployeesService } from "../providers/employees.service";

@ApiInternalServerErrorResponse({
  description: "Internal server error",
  type: InternalServerErrorDto,
})
@Controller("employees")
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @ApiFindAll()
  @Get()
  async findAll(): Promise<PublicEmployeeResponseDto[]> {
    return await this.employeesService.findAll();
  }

  @ApiFindById()
  @Get(":id")
  async findById(@Param("id") id: string): Promise<PublicEmployeeResponseDto> {
    return await this.employeesService.findById(id);
  }

  @ApiCreateEmployee()
  @Post()
  async create(
    @Body() createEmployeeRequestDto: CreateEmployeeRequestDto,
  ): Promise<PublicEmployeeResponseDto> {
    return await this.employeesService.create(createEmployeeRequestDto);
  }

  @ApiUpdateEmployee()
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateEmployeeRequestDto: UpdateEmployeeRequestDto,
  ): Promise<PublicEmployeeResponseDto> {
    return await this.employeesService.update(id, updateEmployeeRequestDto);
  }

  @ApiDeleteEmployee()
  @Delete(":id")
  async delete(@Param("id") id: string): Promise<PublicEmployeeResponseDto> {
    return await this.employeesService.delete(id);
  }
}
