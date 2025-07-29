import { CacheModule } from "@nestjs/cache-manager";
import { getModelToken } from "@nestjs/mongoose";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { Model } from "mongoose";

import type { CreateContractEventRequestDto } from "../dto/request/create-contract-event.dto";
import type { UpdateContractEventRequestDto } from "../dto/request/update-contract-event.dto";
import {
  ContractEvent,
  ContractEventType,
} from "../schemas/contract-event.schema";
import { ContractEventsService } from "./contract-events.service";

describe("ContractEventsService", () => {
  let mockContractEventModel: Model<ContractEvent>;
  let service: ContractEventsService;

  const mockContractEventModelSchema = class {
    private readonly data: any;

    constructor(data: Partial<ContractEvent> = {}) {
      this.data = {
        _id: "1",
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.save = jest.fn().mockResolvedValue(this.data);
    }

    public static readonly find = jest.fn(() => []);
    public static readonly findById = jest.fn();
    public save = jest.fn();
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        ContractEventsService,
        {
          provide: getModelToken(ContractEvent.name),
          useValue: mockContractEventModelSchema,
        },
      ],
    }).compile();

    mockContractEventModel = module.get<Model<ContractEvent>>(
      getModelToken(ContractEvent.name),
    );
    service = module.get<ContractEventsService>(ContractEventsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return an array of contract events", async () => {
      const mockFind = {
        lean: jest.fn().mockResolvedValue([]),
      };

      const spy = jest
        .spyOn(mockContractEventModel, "find")
        .mockReturnValue(
          mockFind as unknown as ReturnType<typeof mockContractEventModel.find>,
        );

      const result = await service.findAll();

      expect(result).toBeInstanceOf(Array);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("should return value from cache if available", async () => {
      const mockFind = {
        lean: jest.fn().mockResolvedValue([]),
      };

      const spy = jest
        .spyOn(mockContractEventModel, "find")
        .mockReturnValue(
          mockFind as unknown as ReturnType<typeof mockContractEventModel.find>,
        );

      // Simulate cache hit
      const cachedResult = await service.findAll();
      expect(cachedResult).toBeInstanceOf(Array);
      expect(spy).toHaveBeenCalledTimes(1);

      // Call again to check cache
      const result = await service.findAll();
      expect(result).toEqual(cachedResult);
      expect(spy).toHaveBeenCalledTimes(1); // Should not call find again
    });
  });

  describe("findById", () => {
    it("should return a contract event", async () => {
      const mockFindById = {
        lean: jest.fn().mockResolvedValue({ _id: "1" }),
      };

      const spy = jest
        .spyOn(mockContractEventModel, "findById")
        .mockReturnValue(
          mockFindById as unknown as ReturnType<
            typeof mockContractEventModel.findById
          >,
        );

      const result = await service.findById("1");

      expect(result).toBeDefined();
      expect(result._id).toEqual("1");
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("should throw NotFoundException if contract event not found", async () => {
      const mockFindById = {
        lean: jest.fn().mockResolvedValue(null),
      };

      jest
        .spyOn(mockContractEventModel, "findById")
        .mockReturnValue(
          mockFindById as unknown as ReturnType<
            typeof mockContractEventModel.findById
          >,
        );

      await expect(service.findById("nonexistent")).rejects.toThrow(
        "ContractEvent with id nonexistent not found",
      );
    });
  });

  describe("findAllByEmployeeCpf", () => {
    it("should return an array of contract events for a given employee CPF", async () => {
      const mockFind = {
        lean: jest.fn().mockResolvedValue([{ _id: "1" }, { _id: "2" }]),
      };

      jest
        .spyOn(mockContractEventModel, "find")
        .mockReturnValue(
          mockFind as unknown as ReturnType<typeof mockContractEventModel.find>,
        );

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

      jest
        .spyOn(mockContractEventModel, "find")
        .mockReturnValue(
          mockFind as unknown as ReturnType<typeof mockContractEventModel.find>,
        );

      const result = await service.findAllByEmployeeCpf("nonexistent");

      expect(result).toEqual([]);
    });
  });

  describe("findManyByIds", () => {
    it("should return an array of contract events", async () => {
      const mockFind = {
        lean: jest.fn().mockResolvedValue([{ _id: "1" }, { _id: "2" }]),
      };

      jest
        .spyOn(mockContractEventModel, "find")
        .mockReturnValue(
          mockFind as unknown as ReturnType<typeof mockContractEventModel.find>,
        );

      const result = await service.findManyByIds(["1", "2"]);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(2);
      expect(result[0]._id).toEqual("1");
      expect(result[1]._id).toEqual("2");
    });

    it("should return an empty array if no contract events found or if no IDs are provided", async () => {
      const mockFind = {
        lean: jest.fn().mockResolvedValue([]),
      };

      jest
        .spyOn(mockContractEventModel, "find")
        .mockReturnValue(
          mockFind as unknown as ReturnType<typeof mockContractEventModel.find>,
        );

      const result1 = await service.findManyByIds(["nonexistent"]);
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
        _id: "1",
        id: "1",
        ...mockDto,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });
    });
  });

  describe("update", () => {
    it("should update a contract event", async () => {
      const mockOldContractEvent: Partial<ContractEvent> = {
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

      const spyFindById = jest
        .spyOn(mockContractEventModel, "findById")
        .mockReturnValue({
          _id: "1",
          ...mockOldContractEvent,
          createdAt: new Date(),
          updatedAt: new Date(),
          save: jest.fn().mockResolvedValue({
            _id: "1",
            ...mockUpdateDto,
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        } as unknown as ReturnType<typeof mockContractEventModel.findById>);

      const result = await service.update("1", mockUpdateDto);

      expect(result).toBeDefined();
      expect(result._id).toEqual("1");
      expect(result.type).toEqual(mockUpdateDto.type);
      expect(spyFindById).toHaveBeenCalledTimes(1);
    });

    it("should throw NotFoundException if contract event not found for update", async () => {
      jest.spyOn(mockContractEventModel, "findById").mockResolvedValue(null);

      await expect(
        service.update("nonexistent", {
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
