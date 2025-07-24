import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { CreateEmployeeRequestDto } from "../dto/request/create-employee.dto";
import { UpdateEmployeeRequestDto } from "../dto/request/update-employee.dto";
import { Employee, EmployeeDocument } from "../schemas/employee.schema";

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name) private readonly userModel: Model<Employee>,
  ) {}

  async findAll(): Promise<EmployeeDocument[]> {
    return await this.userModel.find().exec();
  }

  async findById(id: string): Promise<EmployeeDocument> {
    const employee = await this.userModel.findById(id).exec();

    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    return employee;
  }

  async create(
    createEmployeeRequestDto: CreateEmployeeRequestDto,
  ): Promise<EmployeeDocument> {
    const { name } = createEmployeeRequestDto;

    const createdEmployee = new this.userModel({
      name,
    });

    return await createdEmployee.save();
  }

  async update(
    id: string,
    updateEmployeeRequestDto: UpdateEmployeeRequestDto,
  ): Promise<EmployeeDocument> {
    const { name } = updateEmployeeRequestDto;

    const updatedEmployee = await this.userModel
      .findByIdAndUpdate(id, { name }, { new: true })
      .exec();

    if (!updatedEmployee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    return updatedEmployee;
  }

  async delete(id: string): Promise<EmployeeDocument> {
    const deletedEmployee = await this.userModel.findByIdAndDelete(id).exec();

    if (!deletedEmployee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    return deletedEmployee;
  }
}
