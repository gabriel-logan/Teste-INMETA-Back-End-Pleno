import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Transactional } from "src/common/decorators/transaction/Transactional";
import { ContractEventsService } from "src/contract-events/providers/contract-events.service";
import {
  ContractEvent,
  ContractEventType,
} from "src/contract-events/schemas/contract-event.schema";
import { DocumentTypesService } from "src/document-types/providers/document-types.service";
import { DocumentType } from "src/document-types/schemas/document-type.schema";
import { EmployeeDocumentService } from "src/shared/employee-document/employee-document.service";

import {
  FireEmployeeRequestDto,
  HireAgainEmployeeRequestDto,
} from "../dto/request/action-reason-employee.dto";
import { CreateEmployeeRequestDto } from "../dto/request/create-employee.dto";
import { LinkDocumentTypesDto } from "../dto/request/link-document-types.dto";
import { UpdateEmployeeRequestDto } from "../dto/request/update-employee.dto";
import {
  FireEmployeeResponseDto,
  HireAgainEmployeeResponseDto,
} from "../dto/response/action-reason-employee.dto";
import { DocumentTypeEmployeeLinkedResponseDto } from "../dto/response/documentType-employee-linked.dto";
import { DocumentTypeEmployeeUnlinkedResponseDto } from "../dto/response/documentType-employee-unlinked.dto";
import { PublicEmployeeResponseDto } from "../dto/response/public-employee.dto";
import { ContractStatus, Employee } from "../schemas/employee.schema";

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name) private readonly employeeModel: Model<Employee>,
    private readonly employeeDocumentService: EmployeeDocumentService,
    private readonly documentTypesService: DocumentTypesService,
    private readonly contractEventsService: ContractEventsService,
  ) {}

  private toPublicEmployeeResponseDto(
    employee: Employee & { _id: Types.ObjectId },
  ): PublicEmployeeResponseDto {
    return {
      id: employee._id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      fullName: employee.fullName,
      contractStatus: employee.contractStatus,
      documentTypes: employee.documentTypes as unknown as DocumentType[],
      cpf: employee.cpf,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    };
  }

  async findAll(): Promise<PublicEmployeeResponseDto[]> {
    return (
      await this.employeeModel.find().lean().populate("documentTypes")
    ).map((employee) => this.toPublicEmployeeResponseDto(employee));
  }

  async findById(employeeId: string): Promise<PublicEmployeeResponseDto> {
    const employee = await this.employeeModel
      .findById(employeeId)
      .lean()
      .populate("documentTypes");

    if (!employee) {
      throw new NotFoundException(`Employee with id ${employeeId} not found`);
    }

    return this.toPublicEmployeeResponseDto(employee);
  }

  async findByIdWithContractEvents(
    employeeId: string,
  ): Promise<PublicEmployeeResponseDto & { contractEvents: ContractEvent[] }> {
    const employee = await this.employeeModel
      .findById(employeeId)
      .lean()
      .populate("contractEvents");

    if (!employee) {
      throw new NotFoundException(`Employee with id ${employeeId} not found`);
    }

    const contractEvents =
      await this.contractEventsService.findByEmployeeId(employeeId);

    return {
      ...this.toPublicEmployeeResponseDto(employee),
      contractEvents,
    };
  }

  @Transactional()
  async create(
    createEmployeeDto: CreateEmployeeRequestDto,
  ): Promise<PublicEmployeeResponseDto> {
    const { firstName, lastName, cpf } = createEmployeeDto;

    const parsedCpf = cpf.replace(/\D/g, ""); // Remove non-numeric characters from CPF

    // Create contract Event for hiring
    const contractEvent = await this.contractEventsService.create({
      type: ContractEventType.HIRED,
      date: new Date(),
      reason: "New employee hired",
    });

    const createdEmployee = new this.employeeModel({
      firstName,
      lastName,
      cpf: parsedCpf,
      contractEvents: [contractEvent._id],
    });

    const savedEmployee = await createdEmployee.save();

    return this.toPublicEmployeeResponseDto(savedEmployee);
  }

  async update(
    employeeId: string,
    updateEmployeeDto: UpdateEmployeeRequestDto,
  ): Promise<PublicEmployeeResponseDto> {
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
      throw new NotFoundException(`Employee with id ${employeeId} not found`);
    }

    return this.toPublicEmployeeResponseDto(updatedEmployee);
  }

  async fire(
    employeeId: string,
    fireEmployeeDto: FireEmployeeRequestDto,
  ): Promise<FireEmployeeResponseDto> {
    const deletedEmployee = await this.findById(employeeId);

    if (deletedEmployee.contractStatus === ContractStatus.INACTIVE) {
      throw new BadRequestException(
        `Employee with id ${employeeId} is already inactive`,
      );
    }

    await this.employeeModel.findByIdAndUpdate(
      employeeId,
      { contractStatus: ContractStatus.INACTIVE },
      { new: true, runValidators: true },
    );

    return {
      reason: fireEmployeeDto.reason,
      message: `Successfully terminated contract for employee with id ${employeeId}`,
    };
  }

  async hireAgain(
    employeeId: string,
    hireAgainEmployeeDto: HireAgainEmployeeRequestDto,
  ): Promise<HireAgainEmployeeResponseDto> {
    const employee = await this.findById(employeeId);

    if (employee.contractStatus === ContractStatus.ACTIVE) {
      throw new BadRequestException(
        `Employee with id ${employeeId} is already active`,
      );
    }

    await this.employeeModel.findByIdAndUpdate(
      employeeId,
      { contractStatus: ContractStatus.ACTIVE },
      { new: true, runValidators: true },
    );

    return {
      reason: hireAgainEmployeeDto.reason,
      message: `Successfully rehired employee with id ${employeeId}`,
    };
  }

  @Transactional()
  async linkDocumentTypes(
    employeeId: string,
    linkDocumentTypesDto: LinkDocumentTypesDto,
  ): Promise<DocumentTypeEmployeeLinkedResponseDto> {
    const { documentTypeIds } = linkDocumentTypesDto;

    const documentTypes = await Promise.all(
      documentTypeIds.map((id) => this.documentTypesService.findById(id)),
    );

    const employee = await this.employeeModel.findById(employeeId);

    if (!employee) {
      throw new NotFoundException(`Employee with id ${employeeId} not found`);
    }

    const existing = new Set(
      employee.documentTypes.map((doc) => doc.toString()),
    );

    for (const docId of documentTypes.map(
      (doc) => doc.id as unknown as string,
    )) {
      if (!existing.has(docId)) {
        employee.documentTypes.push(new Types.ObjectId(docId));
      }
    }

    // Create documents for each linked document type
    for (const documentType of documentTypes) {
      await this.employeeDocumentService.createDocument(
        employee._id,
        documentType.id,
      );
    }

    await employee.save();

    return {
      documentTypeIdsLinked: employee.documentTypes.map((doc) =>
        doc.toString(),
      ),
    };
  }

  @Transactional()
  async unlinkDocumentTypes(
    employeeId: string,
    unlinkDocumentTypesDto: LinkDocumentTypesDto,
  ): Promise<DocumentTypeEmployeeUnlinkedResponseDto> {
    const { documentTypeIds } = unlinkDocumentTypesDto;

    const documentTypes = await Promise.all(
      documentTypeIds.map((id) => this.documentTypesService.findById(id)),
    );

    const employee = await this.employeeModel.findById(employeeId);

    if (!employee) {
      throw new NotFoundException(`Employee with id ${employeeId} not found`);
    }

    employee.documentTypes = employee.documentTypes.filter(
      (id) => !documentTypes.map((doc) => doc.id).includes(id),
    );

    // Remove documents associated with the unlinked document types
    for (const documentType of documentTypes) {
      await this.employeeDocumentService.deleteDocument(documentType.id);
    }

    await employee.save();

    return {
      documentTypeIdsUnlinked: employee.documentTypes.map((doc) =>
        doc.toString(),
      ),
    };
  }
}
