import { getModelToken } from "@nestjs/mongoose";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { Connection, Model } from "mongoose";
import { MongooseProvider } from "src/configs/mongoose-provider";
import { ContractEventsService } from "src/contract-events/providers/contract-events.service";
import { DocumentTypesService } from "src/document-types/providers/document-types.service";
import { EmployeeDocumentService } from "src/shared/employee-document/employee-document.service";

import type { CreateEmployeeRequestDto } from "../dto/request/create-employee.dto";
import type { UpdateEmployeeRequestDto } from "../dto/request/update-employee.dto";
import { ContractStatus, Employee } from "../schemas/employee.schema";
import { EmployeesService } from "./employees.service";

describe("EmployeesService", () => {
  let service: EmployeesService;
  let mockEmployeeModel: Model<Employee>;

  const mockEmployeeDocumentService = {
    findById: jest.fn(() => Promise.resolve({})),
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
});
