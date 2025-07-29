import { ConflictException, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Transactional } from "src/common/decorators/transaction/Transactional";
import { ContractEventsService } from "src/contract-events/providers/contract-events.service";
import {
  ContractEvent,
  ContractEventType,
} from "src/contract-events/schemas/contract-event.schema";

import { CreateAdminEmployeeRequestDto } from "../dto/request/create-admin-employee.dto";
import { CreateAdminEmployeeResponseDto } from "../dto/response/create-admin-employee.dto";
import { Employee, EmployeeRole } from "../schemas/employee.schema";

@Injectable()
export class AdminEmployeesService {
  private readonly logger = new Logger(AdminEmployeesService.name);

  constructor(
    @InjectModel(Employee.name) private readonly employeeModel: Model<Employee>,
    private readonly contractEventsService: ContractEventsService,
  ) {}

  private async createContractEvent({
    type,
    reason,
    employee,
  }: {
    type: ContractEventType;
    reason: string;
    employee: { cpf: string; fullName: string };
  }): Promise<ContractEvent> {
    return await this.contractEventsService.create({
      type,
      date: new Date(),
      reason,
      employeeCpf: employee.cpf,
      employeeFullName: employee.fullName,
    });
  }

  @Transactional()
  async createAdminEmployee(
    createAdminEmployeeDto: CreateAdminEmployeeRequestDto,
  ): Promise<CreateAdminEmployeeResponseDto> {
    const { username, password, cpf, firstName, lastName } =
      createAdminEmployeeDto;

    const parsedCpf = cpf.replace(/\D/g, ""); // Remove non-numeric characters from CPF

    // FindByUsername or CPF to ensure uniqueness
    const existingEmployee = await this.employeeModel.findOne({
      $or: [{ username }, { cpf: parsedCpf }],
    });

    if (
      existingEmployee?.username === username ||
      existingEmployee?.cpf === parsedCpf
    ) {
      throw new ConflictException(
        `An employee with username ${username} or CPF ${parsedCpf} already exists`,
      );
    }

    const contractEvent = await this.createContractEvent({
      type: ContractEventType.HIRED,
      reason: "New admin employee hired successfully cpf: " + parsedCpf,
      employee: {
        cpf: parsedCpf,
        fullName: `${firstName} ${lastName}`,
      },
    });

    const newEmployee = new this.employeeModel({
      firstName,
      lastName,
      cpf: parsedCpf,
      contractEvents: [contractEvent._id],
      username,
      password,
      role: EmployeeRole.ADMIN,
    });

    const createdEmployee = await newEmployee.save();

    return {
      _id: createdEmployee._id,
      id: createdEmployee._id.toString(),
      firstName: createdEmployee.firstName,
      lastName: createdEmployee.lastName,
      fullName: createdEmployee.fullName,
      username: createdEmployee.username,
      contractStatus: createdEmployee.contractStatus,
      documentTypes: [],
      cpf: createdEmployee.cpf,
      role: createdEmployee.role,
      createdAt: createdEmployee.createdAt,
      updatedAt: createdEmployee.updatedAt,
    };
  }
}
