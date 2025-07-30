import { getModelToken } from "@nestjs/mongoose";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { Connection, Model } from "mongoose";
import { Types } from "mongoose";
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
  let mockEmployeeModel: Model<Employee>;

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

  const mockEmployeeModelSchema = class {
    private readonly data: any;

    constructor(data: Partial<Employee> = {}) {
      this.data = {
        ...mockEmployee,
        ...data,
        fullName: `${data.firstName} ${data.lastName}`,
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
        AdminEmployeesService,
        ContractEventsService,
        {
          provide: getModelToken(Employee.name),
          useValue: mockEmployeeModelSchema,
        },
      ],
    })
      .overrideProvider(ContractEventsService)
      .useValue(mockContractEventsService)
      .compile();

    service = module.get<AdminEmployeesService>(AdminEmployeesService);
    mockEmployeeModel = module.get<Model<Employee>>(
      getModelToken(Employee.name),
    );
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
    });
  });
});
