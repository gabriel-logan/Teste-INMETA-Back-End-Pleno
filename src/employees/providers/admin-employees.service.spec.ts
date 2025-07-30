import { getModelToken } from "@nestjs/mongoose";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { Connection } from "mongoose";
import { Model, Types } from "mongoose";
import { MongooseProvider } from "src/configs/mongoose-provider";
import { ContractEventsService } from "src/contract-events/providers/contract-events.service";

import type { CreateAdminEmployeeRequestDto } from "../dto/request/create-admin-employee.dto";
import {
  ContractStatus,
  Employee,
  EmployeeRole,
} from "../schemas/employee.schema";
import { AdminEmployeesService } from "./admin-employees.service";

describe("AdminEmployeesService", () => {
  let service: AdminEmployeesService;

  const mockContractEventsService = {
    create: jest.fn(() => Promise.resolve({})),
  };

  const mockGenericObjectId = new Types.ObjectId("507f1f77bcf86cd799439011");

  const mockSave = jest.fn(function (this: any) {
    return Promise.resolve({ ...this });
  });

  const mockEmployeeModelSchema = jest
    .fn()
    .mockImplementation((data: Partial<Employee>) => {
      const now = new Date();
      return {
        _id: mockGenericObjectId,
        id: mockGenericObjectId.toString(),
        createdAt: now,
        updatedAt: now,
        contractStatus: ContractStatus.ACTIVE,
        role: EmployeeRole.ADMIN,
        documentTypes: [],
        fullName: `${data.firstName} ${data.lastName}`,
        save: mockSave,
        ...data,
      };
    }) as unknown as typeof Model & {
    findOne: jest.Mock;
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

    mockEmployeeModelSchema.findOne = jest.fn().mockResolvedValue(null);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminEmployeesService,
        ContractEventsService,
        {
          provide: getModelToken(Employee.name),
          useValue: Model,
        },
      ],
    })
      .overrideProvider(getModelToken(Employee.name))
      .useValue(mockEmployeeModelSchema)
      .overrideProvider(ContractEventsService)
      .useValue(mockContractEventsService)
      .compile();

    service = module.get<AdminEmployeesService>(AdminEmployeesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createAdminEmployee", () => {
    it("should create an admin employee", async () => {
      const createDto: CreateAdminEmployeeRequestDto = {
        firstName: "Admin",
        lastName: "User",
        cpf: "123.456.789-00",
        username: "admin.user",
        password: "securepassword",
      };

      const result = await service.createAdminEmployee(createDto);

      expect(result).toEqual({
        _id: expect.any(Types.ObjectId) as Types.ObjectId,
        id: expect.any(String) as string,
        firstName: "Admin",
        lastName: "User",
        fullName: "Admin User",
        username: "admin.user",
        contractStatus: ContractStatus.ACTIVE,
        role: EmployeeRole.ADMIN,
        documentTypes: [],
        cpf: "12345678900",
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });
      expect(mockEmployeeModelSchema.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
