import { getModelToken } from "@nestjs/mongoose";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { Model } from "mongoose";
import { ContractEventsService } from "src/contract-events/providers/contract-events.service";
import { DocumentTypesService } from "src/document-types/providers/document-types.service";
import { EmployeeDocumentService } from "src/shared/employee-document/employee-document.service";

import { Employee } from "../schemas/employee.schema";
import { EmployeesService } from "./employees.service";

describe("EmployeesService", () => {
  let service: EmployeesService;
  let mockEmployeesService: Model<Employee>;

  const mockEmployeeDocumentService = {
    findById: jest.fn((id: string) => Promise.resolve({})),
  };

  const mockDocumentTypesService = {
    findById: jest.fn((id: string) => Promise.resolve({})),
  };

  const mockContractEventsService = {
    findById: jest.fn((id: string) => Promise.resolve({})),
  };

  const mockDocumentModelSchema = class {
    private readonly data: any;

    constructor(data?: unknown[]) {
      this.data = {
        _id: "1",
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

  const mockEmployeeModelSchema = class {
    private readonly data: any;

    constructor(data?: unknown[]) {
      this.data = {
        _id: "1",
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

  beforeEach(async () => {
    jest.clearAllMocks();

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
    mockEmployeesService = module.get<Model<Employee>>(
      getModelToken(Employee.name),
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
