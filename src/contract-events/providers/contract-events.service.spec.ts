import { CacheModule } from "@nestjs/cache-manager";
import { getModelToken } from "@nestjs/mongoose";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { Model, Types } from "mongoose";

import type { CreateContractEventRequestDto } from "../dto/request/create-contract-event.dto";
import type { UpdateContractEventRequestDto } from "../dto/request/update-contract-event.dto";
import {
  ContractEvent,
  ContractEventType,
} from "../schemas/contract-event.schema";
import { ContractEventsService } from "./contract-events.service";

describe("ContractEventsService", () => {
  let service: ContractEventsService;

  const mockGenericObjectId = new Types.ObjectId("60c72b2f9b1e8b001c8e4d3a");

  const mockDefaultContractEvent = {
    _id: mockGenericObjectId,
    id: mockGenericObjectId.toString(),
    type: ContractEventType.HIRED,
    date: new Date(),
    reason: "Test reason",
    employeeCpf: "12345678901",
    employeeFullName: "John Doe",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSave = jest.fn(function (this: any) {
    return Promise.resolve({ ...this });
  });

  const mockContractEventModel = jest.fn().mockImplementation(
    (data) =>
      ({
        ...mockDefaultContractEvent,
        ...data,
        save: mockSave,
      }) as Model<ContractEvent>,
  ) as unknown as typeof Model & {
    find: jest.Mock;
    findById: jest.Mock;
  };

  mockContractEventModel.find = jest.fn().mockReturnValue({
    lean: jest.fn().mockResolvedValue([mockDefaultContractEvent]),
  });

  mockContractEventModel.findById = jest.fn().mockReturnValue({
    lean: jest.fn().mockResolvedValue(mockDefaultContractEvent),
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        ContractEventsService,
        {
          provide: getModelToken(ContractEvent.name),
          useValue: Model,
        },
      ],
    })
      .overrideProvider(getModelToken(ContractEvent.name))
      .useValue(mockContractEventModel)
      .compile();

    service = module.get<ContractEventsService>(ContractEventsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return an array of contract events", async () => {
      const result = await service.findAll();

      expect(result).toBeInstanceOf(Array);
      expect(mockContractEventModel.find).toHaveBeenCalledTimes(1);
    });

    it("should return value from cache if available", async () => {
      // Simulate cache hit
      const cachedResult = await service.findAll();

      expect(cachedResult).toBeInstanceOf(Array);
      expect(mockContractEventModel.find).toHaveBeenCalledTimes(1);

      // Call again to check cache
      const result = await service.findAll();

      expect(result).toEqual(cachedResult);
      expect(mockContractEventModel.find).toHaveBeenCalledTimes(1); // Should not call find again
    });
  });

  describe("findById", () => {
    it("should return a contract event", async () => {
      const result = await service.findById(mockGenericObjectId);

      expect(result).toBeDefined();
      expect(result._id).toEqual(mockGenericObjectId);
      expect(mockContractEventModel.findById).toHaveBeenCalledTimes(1);
    });

    it("should throw NotFoundException if contract event not found", async () => {
      const mockFindById = {
        lean: jest.fn().mockResolvedValue(null),
      };

      mockContractEventModel.findById.mockReturnValue(mockFindById);

      await expect(
        service.findById("nonexistent" as unknown as Types.ObjectId),
      ).rejects.toThrow("ContractEvent with id nonexistent not found");
    });
  });

  describe("findAllByEmployeeCpf", () => {
    it("should return an array of contract events for a given employee CPF", async () => {
      const mockFind = {
        lean: jest.fn().mockResolvedValue([{ _id: "1" }, { _id: "2" }]),
      };

      mockContractEventModel.find.mockReturnValue(mockFind);

      const result = await service.findAllByEmployeeCpf("12345678901");

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(2);
      expect(result[0]._id).toEqual("1");
      expect(result[1]._id).toEqual("2");
    });

    it("should return an empty array if no contract events found for the given CPF", async () => {
      const mockFind = {
        lean: jest.fn().mockResolvedValue([]),
      };

      mockContractEventModel.find.mockReturnValue(mockFind);

      const result = await service.findAllByEmployeeCpf("nonexistent");

      expect(result).toEqual([]);
    });
  });

  describe("findManyByIds", () => {
    it("should return an array of contract events", async () => {
      const id1 = new Types.ObjectId("60c72b2f9b1e8b001c8e4d3a");
      const id2 = new Types.ObjectId("60c72b2f9b1e8b001c8e4d3b");

      const mockFind = {
        lean: jest.fn().mockResolvedValue([{ _id: id1 }, { _id: id2 }]),
      };

      mockContractEventModel.find.mockReturnValue(mockFind);

      const result = await service.findManyByIds([id1, id2]);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(2);
      expect(result[0]._id).toEqual(id1);
      expect(result[1]._id).toEqual(id2);
    });

    it("should return an empty array if no contract events found or if no IDs are provided", async () => {
      const mockFind = {
        lean: jest.fn().mockResolvedValue([]),
      };

      mockContractEventModel.find.mockReturnValue(mockFind);

      const result1 = await service.findManyByIds([
        "nonexistent" as unknown as Types.ObjectId,
      ]);
      const result2 = await service.findManyByIds([]);

      expect(result1).toEqual([]);
      expect(result2).toEqual([]);
    });
  });

  describe("create", () => {
    it("should create a contract event", async () => {
      const mockDto: CreateContractEventRequestDto = {
        date: new Date(),
        reason: "Test reason",
        type: ContractEventType.HIRED,
        employeeCpf: "12345678901",
        employeeFullName: "John Doe",
      };

      const result = await service.create(mockDto);

      expect(result).toBeDefined();
      expect(result).toEqual({
        _id: mockGenericObjectId,
        id: mockGenericObjectId.toString(),
        ...mockDto,
        date: expect.any(Date) as Date,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });
    });
  });

  describe("update", () => {
    it("should update a contract event", async () => {
      const mockOldContractEvent: Partial<ContractEvent> = {
        _id: mockGenericObjectId,
        type: ContractEventType.HIRED,
        date: new Date(),
        reason: "Initial reason",
        employeeCpf: "12345678901",
        employeeFullName: "John Doe",
      };

      const mockUpdateDto: UpdateContractEventRequestDto = {
        type: ContractEventType.FIRED,
        date: new Date(),
        reason: "Updated reason",
        employeeCpf: "12345678900",
        employeeFullName: "John Doe",
      };

      mockContractEventModel.findById.mockResolvedValue({
        ...mockOldContractEvent,
        save: mockSave,
      });

      const result = await service.update(mockGenericObjectId, mockUpdateDto);

      expect(result).toBeDefined();
      expect(result._id).toEqual(mockGenericObjectId);
      expect(result.type).toEqual(mockUpdateDto.type);
      expect(mockSave).toHaveBeenCalledTimes(1);
    });

    it("should throw NotFoundException if contract event not found for update", async () => {
      mockContractEventModel.findById.mockResolvedValue(null);

      await expect(
        service.update("nonexistent" as unknown as Types.ObjectId, {
          type: ContractEventType.FIRED,
          date: new Date(),
          reason: "Updated reason",
          employeeCpf: "12345678901",
          employeeFullName: "John Doe",
        }),
      ).rejects.toThrow("ContractEvent with id nonexistent not found");
    });
  });
});
