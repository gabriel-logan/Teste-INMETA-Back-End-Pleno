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

@Controller("employees")
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  async create(@Body() createEmployeeRequestDto: CreateEmployeeRequestDto) {
    return await this.employeesService.create(createEmployeeRequestDto);
  }

  @Get()
  async findAll() {
    return await this.employeesService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.employeesService.findOne(id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateEmployeeRequestDto: UpdateEmployeeRequestDto,
  ) {
    return await this.employeesService.update(id, updateEmployeeRequestDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.employeesService.remove(id);
  }
}
