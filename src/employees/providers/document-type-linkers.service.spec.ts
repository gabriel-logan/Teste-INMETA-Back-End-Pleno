import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { Connection } from "mongoose";
import { Types } from "mongoose";
import { MongooseProvider } from "src/configs/mongoose-provider";
import { DocumentTypesService } from "src/document-types/providers/document-types.service";
import { EmployeeDocumentService } from "src/shared/employee-document/employee-document.service";

import { ContractStatus, EmployeeRole } from "../schemas/employee.schema";
import { DocumentTypeLinkersService } from "./document-type-linkers.service";
import { EmployeesService } from "./employees.service";

describe("DocumentTypeLinkersService", () => {
  let service: DocumentTypeLinkersService;

  const mockDocumentTypesService = {
    findById: jest.fn(),
  };

  const mockEmployeeDocumentService = {
    linkDocumentTypes: jest.fn(),
  };

  const mockEmployeesService = {
    findById: jest.fn(),
  };

  const mockGenericObjectId = new Types.ObjectId("507f1f77bcf86cd799439011");

  const mockEmployee = {
    _id: mockGenericObjectId,
    firstName: "Jane",
    lastName: "Doe",
    fullName: "Jane Doe",
    username: "jane.doe",
    contractStatus: ContractStatus.ACTIVE,
    documentTypes: [],
    role: EmployeeRole.COMMON,
    cpf: "987.654.321-00",
    createdAt: new Date(),
    updatedAt: new Date(),
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

  beforeAll(() => {
    // Mock the Mongoose connection
    MongooseProvider.setMongooseInstance(
      mockConnection as unknown as Connection,
    );
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentTypeLinkersService,
        EmployeesService,
        EmployeeDocumentService,
        DocumentTypesService,
      ],
    })
      .overrideProvider(EmployeesService)
      .useValue(mockEmployeesService)
      .overrideProvider(DocumentTypesService)
      .useValue(mockDocumentTypesService)
      .overrideProvider(EmployeeDocumentService)
      .useValue(mockEmployeeDocumentService)
      .compile();

    service = module.get<DocumentTypeLinkersService>(
      DocumentTypeLinkersService,
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
