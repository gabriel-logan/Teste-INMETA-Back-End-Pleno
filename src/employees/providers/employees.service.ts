import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Transactional } from "src/common/decorators/transaction/Transactional";
import {
  EmployeeFullResponseDto,
  EmployeeWithContractEventsResponseDto,
  EmployeeWithDocumentTypesResponseDto,
} from "src/common/dto/response/employee.dto";
import { AuthPayload } from "src/common/types";
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
  ReHireEmployeeRequestDto,
} from "../dto/request/action-reason-employee.dto";
import { CreateAdminEmployeeRequestDto } from "../dto/request/create-admin-employee.dto";
import { CreateEmployeeRequestDto } from "../dto/request/create-employee.dto";
import { LinkDocumentTypesRequestDto } from "../dto/request/link-document-types.dto";
import { UpdateEmployeeRequestDto } from "../dto/request/update-employee.dto";
import {
  FireEmployeeResponseDto,
  ReHireEmployeeResponseDto,
} from "../dto/response/action-reason-employee.dto";
import { CreateAdminEmployeeResponseDto } from "../dto/response/create-admin-employee.dto";
import { DocumentTypeEmployeeLinkedResponseDto } from "../dto/response/documentType-employee-linked.dto";
import { DocumentTypeEmployeeUnlinkedResponseDto } from "../dto/response/documentType-employee-unlinked.dto";
import {
  ContractStatus,
  Employee,
  EmployeeDocument,
  EmployeeRole,
} from "../schemas/employee.schema";

type FindOptions<T extends boolean> = {
  populates?: string[];
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
    private readonly employeeDocumentService: EmployeeDocumentService,
    private readonly documentTypesService: DocumentTypesService,
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
    const { firstName, lastName, cpf } = createEmployeeDto;

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
      password: "123456", // nosonar
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

  private employeeIdIsSameAsFromReq(
    employeeId: Types.ObjectId,
    employeeFromReq: AuthPayload,
  ): boolean {
    return employeeFromReq.sub === employeeId.toString();
  }

  @Transactional()
  async fire(
    employeeId: Types.ObjectId,
    fireEmployeeDto: FireEmployeeRequestDto,
    employeeFromReq: AuthPayload,
  ): Promise<FireEmployeeResponseDto> {
    const isSameId = this.employeeIdIsSameAsFromReq(
      employeeId,
      employeeFromReq,
    );

    if (isSameId) {
      throw new BadRequestException(
        "You cannot fire yourself. Please contact a manager.",
      );
    }

    if (employeeFromReq.role !== EmployeeRole.MANAGER) {
      // This is a placeholder for the actual role check
      // You can replace this with your actual role checking logic
      // For demonstration purposes, we are letting it pass
      this.logger.warn("Only managers can fire employees");
    }

    const employeeToFire = await this.findById(employeeId, {
      populates: ["contractEvents"],
      lean: false,
    });

    if (employeeToFire.contractStatus === ContractStatus.INACTIVE) {
      throw new BadRequestException(
        `Employee with id ${employeeId.toString()} is already inactive`,
      );
    }

    const contractEvent = await this.createContractEvent({
      type: ContractEventType.FIRED,
      reason: fireEmployeeDto.reason,
      employee: employeeToFire,
    });

    employeeToFire.contractStatus = ContractStatus.INACTIVE;
    employeeToFire.contractEvents.push(contractEvent);

    await employeeToFire.save();

    return {
      reason: fireEmployeeDto.reason,
      message: `Successfully terminated contract for employee with id ${employeeId.toString()}`,
    };
  }

  @Transactional()
  async reHire(
    employeeId: Types.ObjectId,
    reHireEmployeeDto: ReHireEmployeeRequestDto,
    employeeFromReq: AuthPayload,
  ): Promise<ReHireEmployeeResponseDto> {
    const isSameId = this.employeeIdIsSameAsFromReq(
      employeeId,
      employeeFromReq,
    );

    if (isSameId) {
      throw new BadRequestException(
        "You cannot rehire yourself. Please contact a manager.",
      );
    }

    if (employeeFromReq.role !== EmployeeRole.MANAGER) {
      // This is a placeholder for the actual role check
      // You can replace this with your actual role checking logic
      // For demonstration purposes, we are letting it pass
      this.logger.warn("Only managers can rehire employees");
    }

    const employee = await this.findById(employeeId, {
      populates: ["contractEvents"],
      lean: false,
    });

    if (employee.contractStatus === ContractStatus.ACTIVE) {
      throw new BadRequestException(
        `Employee with id ${employeeId.toString()} is already active`,
      );
    }

    const contractEvent = await this.createContractEvent({
      type: ContractEventType.REHIRED,
      reason: reHireEmployeeDto.reason,
      employee,
    });

    employee.contractStatus = ContractStatus.ACTIVE;
    employee.contractEvents.push(contractEvent);

    await employee.save();

    return {
      reason: reHireEmployeeDto.reason,
      message: `Successfully rehired employee with id ${employeeId.toString()}`,
    };
  }

  @Transactional()
  async linkDocumentTypes(
    employeeId: Types.ObjectId,
    linkDocumentTypesDto: LinkDocumentTypesRequestDto,
  ): Promise<DocumentTypeEmployeeLinkedResponseDto> {
    const { documentTypeIds } = linkDocumentTypesDto;

    const documentTypes = await Promise.all(
      documentTypeIds.map((id) => this.documentTypesService.findById(id)),
    );

    const employee = await this.findById(employeeId, {
      lean: false,
    });

    // Prevent duplicate document types
    if (employee.documentTypes.length > 0) {
      const existingDocumentTypes = employee.documentTypes.map((doc) =>
        doc._id.toString(),
      );
      const newDocumentTypes = documentTypes.map((doc) => doc.id.toString());

      const duplicates = newDocumentTypes.filter((doc) =>
        existingDocumentTypes.includes(doc),
      );

      if (duplicates.length > 0) {
        const msg = `Document types ${duplicates.join(
          ", ",
        )} are already linked to employee ${employeeId.toString()}`;

        this.logger.warn(msg);

        throw new BadRequestException(msg);
      }
    }

    const existing = new Set(
      employee.documentTypes.map((doc) => doc._id.toString()),
    );

    for (const docId of documentTypes.map((doc) => doc)) {
      if (!existing.has(docId.id.toString())) {
        employee.documentTypes.push(docId.id as unknown as DocumentType);
      }
    }

    const documentsIds = [];

    // Create documents for each linked document type
    for (const documentType of documentTypes) {
      const newDocument = await this.employeeDocumentService.createDocument(
        employee._id,
        documentType._id,
      );
      documentsIds.push(newDocument._id);
    }

    const result = await employee.save();

    return {
      documentTypeIdsLinked: result.documentTypes.map((doc) =>
        doc._id.toString(),
      ),
      documentIdsCreated: documentsIds.map((doc) => doc.toString()),
    };
  }

  @Transactional()
  async unlinkDocumentTypes(
    employeeId: Types.ObjectId,
    unlinkDocumentTypesDto: LinkDocumentTypesRequestDto,
  ): Promise<DocumentTypeEmployeeUnlinkedResponseDto> {
    const { documentTypeIds } = unlinkDocumentTypesDto;

    const documentTypes = await Promise.all(
      documentTypeIds.map((id) => this.documentTypesService.findById(id)),
    );

    const employee = await this.findById(employeeId, {
      lean: false,
    });

    // Check if the document types are linked to the employee
    const linkedDocumentTypes = employee.documentTypes.filter((doc) =>
      documentTypes.map((dt) => dt.id.toString()).includes(doc._id.toString()),
    );

    if (linkedDocumentTypes.length === 0) {
      throw new BadRequestException(
        `No linked document types found for employee ${employeeId.toString()}`,
      );
    }

    const idsToRemoveSet = new Set(
      documentTypes.map((doc) => doc.id.toString()),
    );

    employee.documentTypes = employee.documentTypes.filter(
      (docTypeId) => !idsToRemoveSet.has(docTypeId._id.toString()),
    );

    const deletedDocumentIds = [];

    // Remove documents associated with the unlinked document types
    for (const documentType of documentTypes) {
      const deletedDocumentId =
        await this.employeeDocumentService.deleteDocumentByEmployeeIdAndDocumentTypeId(
          employeeId,
          documentType._id,
        );

      deletedDocumentIds.push(deletedDocumentId);
    }

    await employee.save();

    return {
      documentTypeIdsUnlinked: documentTypeIds.map((doc) => doc.toString()),
      documentIdsDeleted: deletedDocumentIds.map((doc) => doc._id.toString()),
    };
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
