import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { DocumentTypesService } from "src/document-types/providers/document-types.service";
import { DocumentType } from "src/document-types/schemas/document-type.schema";
import { DocumentsService } from "src/documents/providers/documents.service";

import { CreateEmployeeRequestDto } from "../dto/request/create-employee.dto";
import { LinkDocumentTypesDto } from "../dto/request/link-document-types.dto";
import { UpdateEmployeeRequestDto } from "../dto/request/update-employee.dto";
import { DocumentTypeEmployeeLinkedResponseDto } from "../dto/response/documentType-employee-linked.dto";
import { DocumentTypeEmployeeUnlinkedResponseDto } from "../dto/response/documentType-employee-unlinked.dto";
import { PublicEmployeeResponseDto } from "../dto/response/public-employee.dto";
import { Employee } from "../schemas/employee.schema";

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name) private readonly employeeModel: Model<Employee>,
    private readonly documentTypesService: DocumentTypesService,
    @Inject(forwardRef(() => DocumentsService))
    private readonly documentsService: DocumentsService,
  ) {}

  private toPublicEmployeeResponseDto(
    employee: Employee & { _id: Types.ObjectId },
  ): PublicEmployeeResponseDto {
    return {
      id: employee._id,
      name: employee.name,
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
    employeeId: string,
    updateEmployeeDto: UpdateEmployeeRequestDto,
  ): Promise<PublicEmployeeResponseDto> {
    const { name, cpf } = updateEmployeeDto;

    const parsedCpf = cpf?.replace(/\D/g, ""); // Remove non-numeric characters from CPF

    const updatedEmployee = await this.employeeModel
      .findByIdAndUpdate(
        employeeId,
        { name, cpf: parsedCpf },
        { new: true, runValidators: true },
      )
      .lean();

    if (!updatedEmployee) {
      throw new NotFoundException(`Employee with id ${employeeId} not found`);
    }

    return this.toPublicEmployeeResponseDto(updatedEmployee);
  }

  async delete(employeeId: string): Promise<void> {
    const deletedEmployee = await this.employeeModel
      .findByIdAndDelete(employeeId)
      .lean();

    if (!deletedEmployee) {
      throw new NotFoundException(`Employee with id ${employeeId} not found`);
    }

    return void 0;
  }

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

    await employee.save();

    return {
      documentTypeIdsLinked: employee.documentTypes.map((doc) =>
        doc.toString(),
      ),
    };
  }

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

    await employee.save();

    return {
      documentTypeIdsUnlinked: employee.documentTypes.map((doc) =>
        doc.toString(),
      ),
    };
  }
}
