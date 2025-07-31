import { getModelToken } from "@nestjs/mongoose";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { type Connection, Model, Types } from "mongoose";
import type { AuthPayload } from "src/common/types";
import { MongooseProvider } from "src/configs/mongoose-provider";
import { ContractEventsService } from "src/contract-events/providers/contract-events.service";
import { ContractEventType } from "src/contract-events/schemas/contract-event.schema";

import type { CreateEmployeeRequestDto } from "../dto/request/create-employee.dto";
import type { UpdateEmployeeRequestDto } from "../dto/request/update-employee.dto";
import {
  ContractStatus,
  Employee,
  EmployeeRole,
} from "../schemas/employee.schema";
import { EmployeesService } from "./employees.service";

describe("EmployeesService", () => {
  let service: EmployeesService;

  const mockContractEventsService = {
    findById: jest.fn(),
    findManyByIds: jest.fn(),
    create: jest.fn(),
  };

  const mockGenericObjectId = new Types.ObjectId("60c72b2f9b1e8b001c8e4d3a");

  const mockDefaultEmployee = {
    _id: mockGenericObjectId,
    firstName: "Jane",
    lastName: "Doe",
    fullName: "Jane Doe",
    username: "jane.doe",
    contractStatus: ContractStatus.ACTIVE,
    contractEvents: [
      {
        _id: new Types.ObjectId("60c72b2f9b1e8b001c8e4d3b"),
        type: ContractEventType.HIRED,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    documentTypes: [
      {
        _id: new Types.ObjectId("123456789012345678901234"),
        id: "123456789012345678901234",
        name: "Document Type 1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new Types.ObjectId("123456789012345678901235"),
        id: "123456789012345678901235",
        name: "Document Type 2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    role: EmployeeRole.COMMON,
    cpf: "987.654.321-00",
    id: mockGenericObjectId.toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSave = jest.fn(function (this: any) {
    return Promise.resolve({ ...this });
  });

  const mockEmployeeModel = jest.fn().mockImplementation(
    (data) =>
      ({
        ...mockDefaultEmployee,
        ...data,
        save: mockSave,
      }) as Model<Employee>,
  ) as unknown as typeof Model & {
    find: jest.Mock;
    findById: jest.Mock;
    findOne: jest.Mock;
    findByIdAndUpdate: jest.Mock;
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

    mockEmployeeModel.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([mockDefaultEmployee]),
    });

    mockEmployeeModel.findById = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(mockDefaultEmployee),
    });

    mockEmployeeModel.findOne = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockDefaultEmployee),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        ContractEventsService,
        {
          provide: getModelToken(Employee.name),
          useValue: Model,
        },
      ],
    })

      .overrideProvider(getModelToken(Employee.name))
      .useValue(mockEmployeeModel)
      .overrideProvider(ContractEventsService)
      .useValue(mockContractEventsService)
      .compile();

    service = module.get<EmployeesService>(EmployeesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return an array of employees", async () => {
      const result = await service.findAll();

      expect(result).toEqual([mockDefaultEmployee]);
      expect(mockEmployeeModel.find).toHaveBeenCalledTimes(1);
    });

    it("should return an array for filtered employees", async () => {
      mockEmployeeModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      });

      const documentTypeId = new Types.ObjectId("123456789012345678901234");

      const result = await service.findAll({
        byContractStatus: ContractStatus.INACTIVE,
        byCpf: "98765432100",
        byDocumentTypeId: documentTypeId,
        byFirstName: "Jane",
        byLastName: "Doe",
      });

      expect(result).toEqual([]);
      expect(mockEmployeeModel.find).toHaveBeenCalledWith({
        contractStatus: ContractStatus.INACTIVE,
        cpf: "98765432100",
        documentTypes: documentTypeId,
        firstName: { $regex: "^Jane", $options: "i" },
        lastName: { $regex: "^Doe", $options: "i" },
      });
    });

    it("should call populate if is requested", async () => {
      const result = await service.findAll(undefined, {
        populates: ["contractEvents"],
      });

      expect(result).toEqual([mockDefaultEmployee]);
      expect(mockEmployeeModel.find).toHaveBeenCalledWith({});
    });

    it("should call lean if is requested", async () => {
      const result = await service.findAll(undefined, {
        lean: true,
      });

      expect(result).toEqual([mockDefaultEmployee]);
      expect(mockEmployeeModel.find).toHaveBeenCalledWith({});
    });
  });

  describe("findById", () => {
    it("should return an employee by id", async () => {
      const result = await service.findById(mockGenericObjectId);

      expect(result).toEqual(mockDefaultEmployee);
      expect(mockEmployeeModel.findById).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if employee not found", async () => {
      mockEmployeeModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findById(mockGenericObjectId)).rejects.toThrow(
        `Employee with id ${mockGenericObjectId.toString()} not found`,
      );
    });

    it("should call populate if is requested", async () => {
      const result = await service.findById(mockGenericObjectId, {
        populates: ["contractEvents"],
      });

      expect(result).toEqual(mockDefaultEmployee);
      expect(mockEmployeeModel.findById).toHaveBeenCalledWith(
        mockGenericObjectId,
      );
    });
  });

  describe("findOneByUsername", () => {
    it("should return an employee by username", async () => {
      const result = await service.findOneByUsername("jane.doe");

      expect(result).toEqual(mockDefaultEmployee);
      expect(mockEmployeeModel.findOne).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if employee not found", async () => {
      mockEmployeeModel.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOneByUsername("non.existent")).rejects.toThrow(
        `Employee with username non.existent not found`,
      );
    });

    it("should call populate if is requested", async () => {
      mockEmployeeModel.findOne.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockDefaultEmployee),
      });

      const result = await service.findOneByUsername("jane.doe", {
        populates: ["contractEvents"],
      });

      expect(result).toEqual(mockDefaultEmployee);
      expect(mockEmployeeModel.findOne).toHaveBeenCalledWith({
        username: "jane.doe",
      });
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
        ...mockDefaultEmployee,
        contractEvents: mockContractEvents,
      };

      mockContractEventsService.findManyByIds.mockResolvedValue(
        mockContractEvents,
      );

      const result =
        await service.findByIdWithContractEvents(mockGenericObjectId);

      expect(result).toEqual({
        ...mockEmployeeWithEvents,
      });
      expect(mockEmployeeModel.findById).toHaveBeenCalledTimes(1);
      expect(mockContractEventsService.findManyByIds).toHaveBeenCalledTimes(1);
    });
  });

  describe("create", () => {
    it("should create a new employee", async () => {
      const mockContractEvents = [
        {
          _id: "event1",
        },
      ];

      mockContractEventsService.create.mockResolvedValue(mockContractEvents);

      const createDto: CreateEmployeeRequestDto = {
        firstName: "Jane",
        lastName: "Doe",
        cpf: "987.654.321-00",
        password: "password123",
      };

      const result = await service.create(createDto);

      expect(result).toEqual({
        ...mockDefaultEmployee,
        id: mockGenericObjectId.toString(),
        cpf: "98765432100",
        documentTypes: [],
        username: "98765432100",
        contractEvents: [mockContractEvents],
      });
      expect(mockContractEventsService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("update", () => {
    it("should update an employee by id", async () => {
      const updateDto: UpdateEmployeeRequestDto = {
        firstName: "Jane",
        lastName: "Smith",
        cpf: "123.456.789-00",
      };

      mockEmployeeModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue({
          ...mockDefaultEmployee,
          ...updateDto,
          cpf: updateDto.cpf?.replace(/\D/g, ""),
        }),
      });

      const result = await service.update(mockGenericObjectId, updateDto);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { contractEvents, ...employeeWithoutEvents } = mockDefaultEmployee;

      expect(result).toEqual({
        ...employeeWithoutEvents,
        firstName: updateDto.firstName,
        lastName: updateDto.lastName,
        cpf: updateDto.cpf?.replace(/\D/g, ""),
      });
      expect(mockEmployeeModel.findByIdAndUpdate).toHaveBeenCalled();
    });
  });

  describe("updatePassword", () => {
    it("should update an employee's password", async () => {
      const mockUpdatedEmployee = {
        ...mockDefaultEmployee,
        password: "newPassword123",
      };

      mockEmployeeModel.findById = jest.fn().mockReturnValue({
        ...mockUpdatedEmployee,
        save: mockSave,
      });

      const result = await service.updatePassword(
        mockGenericObjectId,
        {
          newPassword: "newPassword123",
        },
        {
          sub: mockGenericObjectId.toString(),
          username: "jane.doe",
          role: EmployeeRole.COMMON,
        } as AuthPayload,
      );

      expect(result).toEqual({
        message: "Password updated successfully",
      });
    });
  });
});
