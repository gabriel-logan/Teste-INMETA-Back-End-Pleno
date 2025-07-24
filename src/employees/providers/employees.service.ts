import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { CreateEmployeeRequestDto } from "../dto/request/create-employee.dto";
import { UpdateEmployeeRequestDto } from "../dto/request/update-employee.dto";
import { PublicEmployeeResponseDto } from "../dto/response/public-employee.dto";
import { Employee } from "../schemas/employee.schema";

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name) private readonly userModel: Model<Employee>,
  ) {}

  async findAll(): Promise<PublicEmployeeResponseDto[]> {
    return (await this.userModel.find().exec()).map((employee) => ({
      id: employee._id,
      name: employee.name,
    }));
  }

  async findById(id: string): Promise<PublicEmployeeResponseDto> {
    const employee = await this.userModel.findById(id).exec();

    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    return {
      id: employee._id,
      name: employee.name,
    };
  }

  async create(
    createEmployeeRequestDto: CreateEmployeeRequestDto,
  ): Promise<PublicEmployeeResponseDto> {
    const { name } = createEmployeeRequestDto;

    const createdEmployee = new this.userModel({
      name,
    });

    const savedEmployee = await createdEmployee.save();

    return {
      id: savedEmployee._id,
      name: savedEmployee.name,
    };
  }

  async update(
    id: string,
    updateEmployeeRequestDto: UpdateEmployeeRequestDto,
  ): Promise<PublicEmployeeResponseDto> {
    const { name } = updateEmployeeRequestDto;

    const updatedEmployee = await this.userModel
      .findByIdAndUpdate(id, { name }, { new: true })
      .exec();

    if (!updatedEmployee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    return {
      id: updatedEmployee._id,
      name: updatedEmployee.name,
    };
  }

  async delete(id: string): Promise<PublicEmployeeResponseDto> {
    const deletedEmployee = await this.userModel.findByIdAndDelete(id).exec();

    if (!deletedEmployee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    return {
      id: deletedEmployee._id,
      name: deletedEmployee.name,
    };
  }
}
