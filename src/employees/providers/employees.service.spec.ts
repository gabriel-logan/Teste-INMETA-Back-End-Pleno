import { getModelToken } from "@nestjs/mongoose";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { type Connection, type Model, Types } from "mongoose";
import type { AuthPayload } from "src/common/types";
import { MongooseProvider } from "src/configs/mongoose-provider";
import { ContractEventsService } from "src/contract-events/providers/contract-events.service";
import { DocumentTypesService } from "src/document-types/providers/document-types.service";
import { EmployeeDocumentService } from "src/shared/employee-document/employee-document.service";

import type {
  FireEmployeeRequestDto,
  ReHireEmployeeRequestDto,
} from "../dto/request/action-reason-employee.dto";
import type { CreateEmployeeRequestDto } from "../dto/request/create-employee.dto";
import type { LinkDocumentTypesRequestDto } from "../dto/request/link-document-types.dto";
import type { UpdateEmployeeRequestDto } from "../dto/request/update-employee.dto";
import {
  ContractStatus,
  Employee,
  EmployeeRole,
} from "../schemas/employee.schema";
import { EmployeesService } from "./employees.service";

describe("EmployeesService", () => {
  let service: EmployeesService;
  let mockEmployeeModel: Model<Employee>;

  const mockEmployeeDocumentService = {
    createDocument: jest.fn(() => Promise.resolve({})),
    deleteDocumentByEmployeeIdAndDocumentTypeId: jest.fn(() =>
      Promise.resolve({}),
    ),
  };

  const mockDocumentTypesService = {
    findById: jest.fn(() => Promise.resolve({})),
  };

  const mockContractEventsService = {
    findById: jest.fn(() => Promise.resolve({})),
    findManyByIds: jest.fn(() => Promise.resolve([])),
    create: jest.fn(() => Promise.resolve({})),
  };

  const mockEmployee = {
    _id: "1",
    firstName: "Jane",
    lastName: "Doe",
    fullName: "Jane Doe",
    contractStatus: ContractStatus.ACTIVE,
    documentTypes: [],
    cpf: "987.654.321-00",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockEmployeeModelSchema = class {
    private readonly data: any;

    constructor(data?: unknown[]) {
      this.data = {
        _id: "1",
        contractStatus: ContractStatus.ACTIVE,
        documentTypes: [],
        fullName: mockEmployee.fullName,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
      };

      this.save = jest.fn().mockResolvedValue(this.data);
    }

    public static readonly find = jest.fn();
    public static readonly findById = jest.fn();
    public static readonly findOne = jest.fn();
    public static readonly findByIdAndUpdate = jest.fn();
    public save = jest.fn();
  };

  const mockSession = {
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    endSession: jest.fn(),
  };

  const mockConnection = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    transaction: jest.fn((fn) => fn(mockSession)),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    // Mock the Mongoose connection
    MongooseProvider.setMongooseInstance(
      mockConnection as unknown as Connection,
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        EmployeeDocumentService,
        DocumentTypesService,
        ContractEventsService,
        {
          provide: getModelToken(Employee.name),
          useValue: mockEmployeeModelSchema,
        },
      ],
    })
      .overrideProvider(EmployeeDocumentService)
      .useValue(mockEmployeeDocumentService)
      .overrideProvider(DocumentTypesService)
      .useValue(mockDocumentTypesService)
      .overrideProvider(ContractEventsService)
      .useValue(mockContractEventsService)
      .compile();

    service = module.get<EmployeesService>(EmployeesService);
    mockEmployeeModel = module.get<Model<Employee>>(
      getModelToken(Employee.name),
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return an array of employees", async () => {
      const spyOnFind = jest.spyOn(mockEmployeeModel, "find").mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([mockEmployee]),
      } as unknown as ReturnType<typeof mockEmployeeModel.find>);

      const result = await service.findAll();

      expect(result).toEqual([
        {
          id: "1",
          firstName: "Jane",
          lastName: "Doe",
          fullName: "Jane Doe",
          contractStatus: ContractStatus.ACTIVE,
          documentTypes: [],
          cpf: "987.654.321-00",
          createdAt: expect.any(Date) as Date,
          updatedAt: expect.any(Date) as Date,
        },
      ]);
      expect(spyOnFind).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("should return an employee by id", async () => {
      const spyOnFindById = jest
        .spyOn(mockEmployeeModel, "findById")
        .mockReturnValue({
          populate: jest.fn().mockReturnThis(),
          lean: jest.fn().mockResolvedValue(mockEmployee),
        } as unknown as ReturnType<typeof mockEmployeeModel.findById>);

      const result = await service.findById("1");

      expect(result).toEqual({
        id: "1",
        firstName: "Jane",
        lastName: "Doe",
        fullName: "Jane Doe",
        contractStatus: ContractStatus.ACTIVE,
        documentTypes: [],
        cpf: "987.654.321-00",
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });
      expect(spyOnFindById).toHaveBeenCalled();
    });
  });

  describe("findByUsername", () => {
    it("should return an employee by username", async () => {
      const spyOnFindByUsername = jest
        .spyOn(mockEmployeeModel, "findOne")
        .mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockEmployee),
        } as unknown as ReturnType<typeof mockEmployeeModel.findOne>);

      const result = await service.findByUsername("jane.doe");

      expect(result).toEqual(mockEmployee);
      expect(spyOnFindByUsername).toHaveBeenCalled();
    });
  });

  describe("findByIdWithContractEvents", () => {
    it("should return an employee with contract events by id", async () => {
      const mockContractEvents = [
        {
          _id: "event1",
        },
      ];

      const mockEmployeeWithEvents = {
        ...mockEmployee,
        contractEvents: mockContractEvents,
      };

      const spyOnFindManyByIds = jest
        .spyOn(mockContractEventsService, "findManyByIds")
        .mockResolvedValue(mockContractEvents as never);

      const spyOnFindById = jest
        .spyOn(mockEmployeeModel, "findById")
        .mockReturnValue({
          populate: jest.fn().mockReturnThis(),
          lean: jest.fn().mockResolvedValue(mockEmployeeWithEvents),
        } as unknown as ReturnType<typeof mockEmployeeModel.findById>);

      const result = await service.findByIdWithContractEvents("1");

      expect(result).toEqual({
        id: "1",
        firstName: "Jane",
        lastName: "Doe",
        fullName: "Jane Doe",
        contractStatus: ContractStatus.ACTIVE,
        documentTypes: [],
        cpf: "987.654.321-00",
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
        contractEvents: mockContractEvents,
      });
      expect(spyOnFindById).toHaveBeenCalledTimes(1);
      expect(spyOnFindManyByIds).toHaveBeenCalledTimes(1);
    });
  });

  describe("create", () => {
    it("should create a new employee", async () => {
      const mockContractEvents = [
        {
          _id: "event1",
        },
      ];

      const spyOnCreateContractEvent = jest
        .spyOn(mockContractEventsService, "create")
        .mockResolvedValue(mockContractEvents as never);

      const createDto: CreateEmployeeRequestDto = {
        firstName: "Jane",
        lastName: "Doe",
        cpf: "987.654.321-00",
      };

      const result = await service.create(createDto);

      expect(result).toEqual({
        id: "1",
        firstName: "Jane",
        lastName: "Doe",
        fullName: "Jane Doe",
        contractStatus: ContractStatus.ACTIVE,
        documentTypes: [],
        cpf: "98765432100",
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });
      expect(spyOnCreateContractEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe("update", () => {
    it("should update an employee by id", async () => {
      const updateDto: UpdateEmployeeRequestDto = {
        firstName: "Jane",
        lastName: "Smith",
        cpf: "123.456.789-00",
      };

      const spyOnFindByIdAndUpdate = jest
        .spyOn(mockEmployeeModel, "findByIdAndUpdate")
        .mockReturnValue({
          lean: jest.fn().mockResolvedValue({
            _id: "1",
            fullName: "Jane Smith",
            contractStatus: ContractStatus.ACTIVE,
            documentTypes: [],
            firstName: updateDto.firstName,
            lastName: updateDto.lastName,
            cpf: updateDto.cpf?.replace(/\D/g, ""),
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        } as unknown as ReturnType<typeof mockEmployeeModel.findByIdAndUpdate>);

      const result = await service.update("1", updateDto);

      expect(result).toEqual({
        id: "1",
        firstName: "Jane",
        lastName: "Smith",
        fullName: "Jane Smith",
        contractStatus: ContractStatus.ACTIVE,
        documentTypes: [],
        cpf: "12345678900",
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });
      expect(spyOnFindByIdAndUpdate).toHaveBeenCalled();
    });
  });

  describe("fire", () => {
    it("should fire an employee by id", async () => {
      const spyOnFindById = jest
        .spyOn(mockEmployeeModel, "findById")
        .mockReturnValue({
          populate: jest.fn().mockResolvedValue({
            _id: "1",
            fullName: "Jane Smith",
            contractStatus: ContractStatus.ACTIVE,
            documentTypes: [],
            contractEvents: [
              {
                _id: "event1",
                type: "hire",
                reason: "Initial hire",
              },
            ],
            firstName: "Jane",
            lastName: "Smith",
            cpf: "12345678900",
            createdAt: new Date(),
            updatedAt: new Date(),
            save: jest.fn().mockResolvedValue({}),
          }),
        } as unknown as ReturnType<typeof mockEmployeeModel.findByIdAndUpdate>);

      const fireEmployeeDto: FireEmployeeRequestDto = {
        reason: "Performance issues",
      };

      const mockAuthPayload: AuthPayload = {
        sub: new Types.ObjectId("60c72b2f9b1e8d001c8e4f1a"),
        username: "admin",
        role: EmployeeRole.ADMIN,
      };

      const employeeId = "1";

      const result = await service.fire(
        employeeId,
        fireEmployeeDto,
        mockAuthPayload,
      );

      expect(result).toEqual({
        reason: fireEmployeeDto.reason,
        message: `Successfully terminated contract for employee with id ${employeeId}`,
      });
      expect(spyOnFindById).toHaveBeenCalledTimes(1);
    });
  });

  describe("reHire", () => {
    it("should rehire an employee by id", async () => {
      const spyOnFindById = jest
        .spyOn(mockEmployeeModel, "findById")
        .mockReturnValue({
          populate: jest.fn().mockResolvedValue({
            _id: "1",
            fullName: "Jane Smith",
            contractStatus: ContractStatus.INACTIVE,
            documentTypes: [],
            contractEvents: [
              {
                _id: "event1",
                type: "hire",
                reason: "Initial hire",
              },
              {
                _id: "event2",
                type: "fire",
                reason: "Performance issues",
              },
            ],
            firstName: "Jane",
            lastName: "Smith",
            cpf: "12345678900",
            createdAt: new Date(),
            updatedAt: new Date(),
            save: jest.fn().mockResolvedValue({}),
          }),
        } as unknown as ReturnType<typeof mockEmployeeModel.findById>);

      const mockAuthPayload: AuthPayload = {
        sub: new Types.ObjectId("60c72b2f9b1e8d001c8e4f1a"),
        username: "admin",
        role: EmployeeRole.ADMIN,
      };

      const employeeId = "1";

      const reHireEmployeeDto: ReHireEmployeeRequestDto = {
        reason: "Rehired for new project",
      };

      const result = await service.reHire(
        employeeId,
        reHireEmployeeDto,
        mockAuthPayload,
      );

      expect(result).toEqual({
        message: `Successfully rehired employee with id ${employeeId}`,
        reason: reHireEmployeeDto.reason,
      });
      expect(spyOnFindById).toHaveBeenCalledTimes(1);
    });
  });

  describe("linkDocumentTypes", () => {
    it("should link document types to an employee", async () => {
      const spyOnFindById = jest
        .spyOn(mockEmployeeModel, "findById")
        .mockReturnValue({
          _id: "1",
          fullName: "Jane Smith",
          contractStatus: ContractStatus.ACTIVE,
          documentTypes: [],
          firstName: "Jane",
          lastName: "Smith",
          cpf: "12345678900",
          createdAt: new Date(),
          updatedAt: new Date(),
          save: jest.fn().mockResolvedValue({
            documentTypes: [
              {
                _id: "doc1",
                name: "Document Type 1",
              },
              {
                _id: "doc2",
                name: "Document Type 2",
              },
            ],
          }),
        } as unknown as ReturnType<typeof mockEmployeeModel.findById>);

      const linkDocumentTypesDto: LinkDocumentTypesRequestDto = {
        documentTypeIds: ["doc1", "doc2"],
      };

      linkDocumentTypesDto.documentTypeIds.forEach((docId) => {
        jest.spyOn(mockDocumentTypesService, "findById").mockResolvedValue({
          id: docId,
          name: `Document Type ${docId}`,
        } as never);
      });

      const employeeId = "1";

      const result = await service.linkDocumentTypes(
        employeeId,
        linkDocumentTypesDto,
      );

      expect(result).toEqual({
        documentTypeIdsLinked: linkDocumentTypesDto.documentTypeIds,
      });
      expect(spyOnFindById).toHaveBeenCalledTimes(1);
    });
  });

  describe("unlinkDocumentTypes", () => {
    it("should unlink document types from an employee", async () => {
      const spyOnFindById = jest
        .spyOn(mockEmployeeModel, "findById")
        .mockReturnValue({
          _id: "1",
          fullName: "Jane Smith",
          contractStatus: ContractStatus.ACTIVE,
          documentTypes: [
            { _id: "doc1", name: "Document Type 1" },
            { _id: "doc2", name: "Document Type 2" },
          ],
          firstName: "Jane",
          lastName: "Smith",
          cpf: "12345678900",
          createdAt: new Date(),
          updatedAt: new Date(),
          save: jest.fn().mockResolvedValue({
            documentTypes: [{ _id: "doc2", name: "Document Type 2" }],
          }),
        } as unknown as ReturnType<typeof mockEmployeeModel.findById>);

      const documentTypeIdsToUnlink: LinkDocumentTypesRequestDto = {
        documentTypeIds: ["doc1"],
      };

      documentTypeIdsToUnlink.documentTypeIds.forEach((docId) => {
        jest.spyOn(mockDocumentTypesService, "findById").mockResolvedValue({
          id: docId,
          name: `Document Type ${docId}`,
        } as never);
      });

      const employeeId = "1";

      const result = await service.unlinkDocumentTypes(
        employeeId,
        documentTypeIdsToUnlink,
      );

      expect(result).toEqual({
        documentTypeIdsUnlinked: documentTypeIdsToUnlink.documentTypeIds,
      });
      expect(spyOnFindById).toHaveBeenCalledTimes(1);
    });
  });
});
