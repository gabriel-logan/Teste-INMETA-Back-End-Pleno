import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { Connection } from "mongoose";
import { Types } from "mongoose";
import { MongooseProvider } from "src/configs/mongoose-provider";
import { ContractEventsService } from "src/contract-events/providers/contract-events.service";

import { ContractStatus, EmployeeRole } from "../schemas/employee.schema";
import { EmployeesService } from "./employees.service";
import { HumanResourcesService } from "./human-resources.service";

describe("HumanResourcesService", () => {
  let service: HumanResourcesService;

  const mockEmployeesService = {
    findById: jest.fn(),
  };

  const mockContractEventsService = {
    create: jest.fn(() => Promise.resolve({})),
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
        HumanResourcesService,
        EmployeesService,
        ContractEventsService,
      ],
    })
      .overrideProvider(EmployeesService)
      .useValue(mockEmployeesService)
      .overrideProvider(ContractEventsService)
      .useValue(mockContractEventsService)
      .compile();

    service = module.get<HumanResourcesService>(HumanResourcesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
