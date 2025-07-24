import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { CreateEmployeeRequestDto } from "../dto/request/create-employee.dto";
import { UpdateEmployeeRequestDto } from "../dto/request/update-employee.dto";
import { PublicEmployeeResponseDto } from "../dto/response/public-employee.dto";
import { Employee } from "../schemas/employee.schema";

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name) private readonly employeeModel: Model<Employee>,
  ) {}

  private toPublicEmployeeResponseDto(
    employee: Employee & { _id: Types.ObjectId },
  ): PublicEmployeeResponseDto {
    return {
      id: employee._id,
      name: employee.name,
      contractStatus: employee.contractStatus,
      cpf: employee.cpf,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    };
  }

  async findAll(): Promise<PublicEmployeeResponseDto[]> {
    return (await this.employeeModel.find().lean()).map((employee) =>
      this.toPublicEmployeeResponseDto(employee),
    );
  }

  async findById(id: string): Promise<PublicEmployeeResponseDto> {
    const employee = await this.employeeModel.findById(id).lean();

    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    return this.toPublicEmployeeResponseDto(employee);
  }

  async create(
    createEmployeeDto: CreateEmployeeRequestDto,
  ): Promise<PublicEmployeeResponseDto> {
    const { name, cpf } = createEmployeeDto;

    const parsedCpf = cpf.replace(/\D/g, ""); // Remove non-numeric characters from CPF

    const createdEmployee = new this.employeeModel({
      name,
      cpf: parsedCpf,
    });

    const savedEmployee = await createdEmployee.save();

    return this.toPublicEmployeeResponseDto(savedEmployee);
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeRequestDto,
  ): Promise<PublicEmployeeResponseDto> {
    const { name, cpf } = updateEmployeeDto;

    const parsedCpf = cpf?.replace(/\D/g, ""); // Remove non-numeric characters from CPF

    const updatedEmployee = await this.employeeModel
      .findByIdAndUpdate(
        id,
        { name, cpf: parsedCpf },
        { new: true, runValidators: true },
      )
      .lean();

    if (!updatedEmployee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    return this.toPublicEmployeeResponseDto(updatedEmployee);
  }

  async delete(id: string): Promise<void> {
    const deletedEmployee = await this.employeeModel
      .findByIdAndDelete(id)
      .lean();

    if (!deletedEmployee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    return void 0;
  }
}
