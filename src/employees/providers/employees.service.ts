import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { compare } from "bcrypt";
import { Model, Types } from "mongoose";
import { Transactional } from "src/common/decorators/transaction/Transactional";
import {
  EmployeeFullResponseDto,
  EmployeeWithContractEventsResponseDto,
  EmployeeWithDocumentTypesResponseDto,
} from "src/common/dto/response/employee.dto";
import { AuthPayload } from "src/common/types";
import { ContractEventsService } from "src/contract-events/providers/contract-events.service";
import { ContractEventType } from "src/contract-events/schemas/contract-event.schema";

import { CreateEmployeeRequestDto } from "../dto/request/create-employee.dto";
import { UpdateEmployeeRequestDto } from "../dto/request/update-employee.dto";
import { UpdateEmployeePasswordRequestDto } from "../dto/request/update-employee-password.dto";
import { UpdateEmployeePasswordResponseDto } from "../dto/response/update-employee-password.dto";
import {
  ContractStatus,
  Employee,
  EmployeeDocument,
  EmployeeRole,
} from "../schemas/employee.schema";

type EmployeePopulatableFields = "documentTypes" | "contractEvents";

type FindOptions<T extends boolean> = {
  populates?: EmployeePopulatableFields[];
  lean?: T;
};

type EmployeeFilters = {
  byFirstName?: string;
  byLastName?: string;
  byContractStatus?: ContractStatus;
  byDocumentTypeId?: Types.ObjectId;
  byCpf?: string;
};

@Injectable()
export class EmployeesService {
  private readonly logger = new Logger(EmployeesService.name);

  constructor(
    @InjectModel(Employee.name) private readonly employeeModel: Model<Employee>,
    private readonly contractEventsService: ContractEventsService,
  ) {}

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  private genericEmployeeResponseMapper(
    employee: Employee,
  ): EmployeeWithDocumentTypesResponseDto {
    return {
      _id: employee._id,
      id: employee._id.toString(),
      firstName: employee.firstName,
      lastName: employee.lastName,
      fullName: employee.fullName,
      username: employee.username,
      cpf: employee.cpf,
      role: employee.role,
      contractStatus: employee.contractStatus,
      documentTypes: employee.documentTypes.map((docType) => ({
        _id: docType._id,
        id: docType._id.toString(),
        name: docType.name,
        createdAt: docType.createdAt,
        updatedAt: docType.updatedAt,
      })),
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    };
  }

  async findAll(
    filters?: EmployeeFilters,
    options?: FindOptions<true>,
  ): Promise<Employee[]>;

  async findAll(
    filters?: EmployeeFilters,
    options?: FindOptions<false>,
  ): Promise<EmployeeDocument[]>;

  async findAll(
    filters: EmployeeFilters = {},
    options: FindOptions<boolean> = {},
  ): Promise<(Employee | EmployeeDocument)[]> {
    const {
      byFirstName,
      byLastName,
      byContractStatus,
      byDocumentTypeId,
      byCpf,
    } = filters;

    const { populates = [], lean = true } = options;

    const filter: Record<string, any> = {};

    if (byFirstName) {
      filter.firstName = {
        $regex: "^" + this.escapeRegex(byFirstName),
        $options: "i",
      };
    }

    if (byLastName) {
      filter.lastName = {
        $regex: "^" + this.escapeRegex(byLastName),
        $options: "i",
      };
    }

    if (byContractStatus) {
      filter.contractStatus = byContractStatus;
    }

    if (byDocumentTypeId) {
      filter.documentTypes = byDocumentTypeId;
    }

    if (byCpf) {
      filter.cpf = byCpf;
    }

    let query = this.employeeModel.find(filter);

    for (const populate of populates) {
      query = query.populate(populate);
    }

    const employees = await (lean ? query.lean() : query);

    return employees;
  }

  async findById(
    employeeId: Types.ObjectId,
    options?: FindOptions<true>,
  ): Promise<Employee>;

  async findById(
    employeeId: Types.ObjectId,
    options?: FindOptions<false>,
  ): Promise<EmployeeDocument>;

  async findById(
    employeeId: Types.ObjectId,
    options: FindOptions<boolean> = {},
  ): Promise<Employee | EmployeeDocument> {
    const { populates = [], lean = true } = options;

    let query = this.employeeModel.findById(employeeId);

    for (const populate of populates) {
      query = query.populate(populate);
    }

    const employee = await (lean ? query.lean() : query);

    if (!employee) {
      throw new NotFoundException(
        `Employee with id ${employeeId.toString()} not found`,
      );
    }

    return employee;
  }

  async findOneByUsername(
    username: string,
    options?: FindOptions<true>,
  ): Promise<Employee>;

  async findOneByUsername(
    username: string,
    options?: FindOptions<false>,
  ): Promise<EmployeeDocument>;

  async findOneByUsername(
    username: string,
    options: FindOptions<boolean> = {},
  ): Promise<Employee | EmployeeDocument> {
    const { populates = [], lean = true } = options;

    let query = this.employeeModel.findOne({ username });

    for (const populate of populates) {
      query = query.populate(populate);
    }

    const employee = await (lean ? query.lean() : query);

    if (!employee) {
      throw new NotFoundException(
        `Employee with username ${username} not found`,
      );
    }

    return employee;
  }

  async findAllWithDocumentTypes({
    byFirstName,
    byLastName,
    byContractStatus,
    byDocumentTypeId,
    byCpf,
  }: {
    byFirstName?: string;
    byLastName?: string;
    byContractStatus?: ContractStatus;
    byDocumentTypeId?: Types.ObjectId;
    byCpf?: string;
  } = {}): Promise<EmployeeWithDocumentTypesResponseDto[]> {
    const employees = await this.findAll(
      {
        byFirstName,
        byLastName,
        byContractStatus,
        byDocumentTypeId,
        byCpf,
      },
      { populates: ["documentTypes"], lean: true },
    );

    return employees.map((employee) =>
      this.genericEmployeeResponseMapper(employee),
    );
  }

  async findByIdWithDocumentTypes(
    employeeId: Types.ObjectId,
  ): Promise<EmployeeWithDocumentTypesResponseDto> {
    const employee = await this.findById(employeeId, {
      populates: ["documentTypes"],
      lean: true,
    });

    return this.genericEmployeeResponseMapper(employee);
  }

  async findByIdWithContractEvents(
    employeeId: Types.ObjectId,
  ): Promise<EmployeeWithContractEventsResponseDto> {
    const employee = await this.findById(employeeId, {
      populates: ["contractEvents"],
    });

    const contractEvents = await this.contractEventsService.findManyByIds(
      employee.contractEvents.map((event) => event._id),
    );

    return {
      ...this.genericEmployeeResponseMapper(employee),
      contractEvents,
    };
  }

  @Transactional()
  async create(
    createEmployeeDto: CreateEmployeeRequestDto,
  ): Promise<EmployeeFullResponseDto> {
    const { firstName, lastName, cpf, password } = createEmployeeDto;

    const parsedCpf = cpf.replace(/\D/g, ""); // Remove non-numeric characters from CPF

    // Create contract Event for hiring
    const contractEvent = await this.contractEventsService.create({
      type: ContractEventType.HIRED,
      date: new Date(),
      reason: "New common employee hired successfully",
      employeeCpf: parsedCpf,
      employeeFullName: `${firstName} ${lastName}`,
    });

    const createdEmployee = new this.employeeModel({
      firstName,
      lastName,
      cpf: parsedCpf,
      contractEvents: [contractEvent._id],
      username: parsedCpf,
      password,
    });

    const savedEmployee = await createdEmployee.save();

    return {
      _id: savedEmployee._id,
      id: savedEmployee._id.toString(),
      firstName: savedEmployee.firstName,
      lastName: savedEmployee.lastName,
      fullName: savedEmployee.fullName,
      username: savedEmployee.username,
      cpf: savedEmployee.cpf,
      role: savedEmployee.role,
      contractStatus: savedEmployee.contractStatus,
      contractEvents: [contractEvent],
      documentTypes: [],
      createdAt: savedEmployee.createdAt,
      updatedAt: savedEmployee.updatedAt,
    };
  }

  async update(
    employeeId: Types.ObjectId,
    updateEmployeeDto: UpdateEmployeeRequestDto,
  ): Promise<EmployeeWithDocumentTypesResponseDto> {
    const { firstName, lastName, cpf } = updateEmployeeDto;

    const parsedCpf = cpf?.replace(/\D/g, ""); // Remove non-numeric characters from CPF

    const updatedEmployee = await this.employeeModel
      .findByIdAndUpdate(
        employeeId,
        { firstName, lastName, cpf: parsedCpf },
        { new: true, runValidators: true },
      )
      .lean();

    if (!updatedEmployee) {
      throw new NotFoundException(
        `Employee with id ${employeeId.toString()} not found`,
      );
    }

    return this.genericEmployeeResponseMapper(updatedEmployee);
  }

  @Transactional()
  async updatePassword(
    employeeId: Types.ObjectId,
    updateEmployeePasswordRequestDto: UpdateEmployeePasswordRequestDto,
    employeeFromReq: AuthPayload,
  ): Promise<UpdateEmployeePasswordResponseDto> {
    if (employeeFromReq.role === EmployeeRole.COMMON) {
      if (employeeFromReq.sub !== employeeId.toString()) {
        throw new BadRequestException("Something went wrong, contact support");
      }
    }

    const { newPassword, currentPassword } = updateEmployeePasswordRequestDto;

    if (newPassword === currentPassword) {
      throw new BadRequestException(
        "New password cannot be the same as the current password",
      );
    }

    const employee = await this.findById(employeeId, {
      lean: false,
    });

    const isCurrentPasswordValid = await compare(
      currentPassword,
      employee.password,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException("Current password is incorrect");
    }

    employee.password = newPassword;

    await employee.save();

    return {
      message: "Password updated successfully",
    };
  }
}
