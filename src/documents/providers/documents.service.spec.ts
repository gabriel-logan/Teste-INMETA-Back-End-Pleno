import { ConfigModule } from "@nestjs/config";
import { getModelToken } from "@nestjs/mongoose";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { Model } from "mongoose";
import envTests from "src/configs/env.tests";
import { EmployeesService } from "src/employees/providers/employees.service";
import { ContractStatus } from "src/employees/schemas/employee.schema";

import { Document } from "../schemas/document.schema";
import { DocumentsService } from "./documents.service";

describe("DocumentsService", () => {
  let service: DocumentsService;
  let mockDocumentModel: Model<Document>;

  const mockEmployeesService = {
    findById: jest.fn((id: string) =>
      Promise.resolve({
        id: id,
        firstName: "John",
        lastName: "Doe",
        fullName: "John Doe",
        contractStatus: ContractStatus.ACTIVE,
        documentTypes: [],
        cpf: "123.456.789-00",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ),
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

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(envTests)],
      providers: [
        DocumentsService,
        EmployeesService,
        {
          provide: getModelToken(Document.name),
          useValue: mockDocumentModelSchema,
        },
      ],
    })
      .overrideProvider(EmployeesService)
      .useValue(mockEmployeesService)
      .compile();

    service = module.get<DocumentsService>(DocumentsService);
    mockDocumentModel = module.get<Model<Document>>(
      getModelToken(Document.name),
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
