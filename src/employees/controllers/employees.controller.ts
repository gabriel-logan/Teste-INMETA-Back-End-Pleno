import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { CreateEmployeeRequestDto } from "../dto/request/create-employee.dto";
import { UpdateEmployeeRequestDto } from "../dto/request/update-employee.dto";
import { EmployeesService } from "../providers/employees.service";
import { EmployeeDocument } from "../schemas/employee.schema";

@Controller("employees")
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  async findAll(): Promise<EmployeeDocument[]> {
    return await this.employeesService.findAll();
  }

  @Get(":id")
  async findById(@Param("id") id: string): Promise<EmployeeDocument> {
    return await this.employeesService.findById(id);
  }

  @Post()
  async create(
    @Body() createEmployeeRequestDto: CreateEmployeeRequestDto,
  ): Promise<EmployeeDocument> {
    return await this.employeesService.create(createEmployeeRequestDto);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateEmployeeRequestDto: UpdateEmployeeRequestDto,
  ): Promise<EmployeeDocument> {
    return await this.employeesService.update(id, updateEmployeeRequestDto);
  }

  @Delete(":id")
  async delete(@Param("id") id: string): Promise<EmployeeDocument> {
    return await this.employeesService.delete(id);
  }
}
