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
    @InjectModel(Employee.name) private readonly employeeModel: Model<Employee>,
  ) {}

  async findAll(): Promise<PublicEmployeeResponseDto[]> {
    return (
      await this.employeeModel
        .find()
        .populate({ path: "documents", populate: { path: "documentType" } })
        .exec()
    ).map((employee) => ({
      id: employee._id,
      name: employee.name,
      documents: employee.documents,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    }));
  }

  async findById(id: string): Promise<PublicEmployeeResponseDto> {
    const employee = await this.employeeModel.findById(id).exec();

    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    return {
      id: employee._id,
      name: employee.name,
      documents: employee.documents,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    };
  }

  async create(
    createEmployeeDto: CreateEmployeeRequestDto,
  ): Promise<PublicEmployeeResponseDto> {
    const { name } = createEmployeeDto;

    const createdEmployee = new this.employeeModel({
      name,
    });

    const savedEmployee = await createdEmployee.save();

    return {
      id: savedEmployee._id,
      name: savedEmployee.name,
      documents: savedEmployee.documents,
      createdAt: savedEmployee.createdAt,
      updatedAt: savedEmployee.updatedAt,
    };
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeRequestDto,
  ): Promise<PublicEmployeeResponseDto> {
    const { name } = updateEmployeeDto;

    const updatedEmployee = await this.employeeModel
      .findByIdAndUpdate(id, { name }, { new: true, runValidators: true })
      .exec();

    if (!updatedEmployee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    return {
      id: updatedEmployee._id,
      name: updatedEmployee.name,
      documents: updatedEmployee.documents,
      createdAt: updatedEmployee.createdAt,
      updatedAt: updatedEmployee.updatedAt,
    };
  }

  async delete(id: string): Promise<PublicEmployeeResponseDto> {
    const deletedEmployee = await this.employeeModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedEmployee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    return {
      id: deletedEmployee._id,
      name: deletedEmployee.name,
      documents: deletedEmployee.documents,
      createdAt: deletedEmployee.createdAt,
      updatedAt: deletedEmployee.updatedAt,
    };
  }
}
