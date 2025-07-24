import { Injectable } from "@nestjs/common";

import { CreateEmployeeRequestDto } from "../dto/request/create-employee.dto";
import { UpdateEmployeeRequestDto } from "../dto/request/update-employee.dto";

@Injectable()
export class EmployeesService {
  async create(createEmployeeRequestDto: CreateEmployeeRequestDto) {
    return "This action adds a new employee";
  }

  async findAll() {
    return `This action returns all employees`;
  }

  async findOne(id: string) {
    return `This action returns a #${id} employee`;
  }

  async update(id: string, updateEmployeeRequestDto: UpdateEmployeeRequestDto) {
    return `This action updates a #${id} employee`;
  }

  async remove(id: string) {
    return `This action removes a #${id} employee`;
  }
}
