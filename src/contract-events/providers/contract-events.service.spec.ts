import { getModelToken } from "@nestjs/mongoose";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { Model } from "mongoose";

import type { CreateContractEventRequestDto } from "../dto/request/create-contract-event.dto";
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

    constructor(data?: unknown[]) {
      this.data = {
        _id: "1",
        ...data,
      };

      this.save = jest.fn().mockResolvedValue(this.data);
    }

    public static readonly find = jest.fn(() => []);
    public static readonly findById = jest.fn();
    public static readonly findByIdAndUpdate = jest.fn();
    public static readonly findByIdAndDelete = jest.fn();
    public save = jest.fn();
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    it("should return an empty array if no contract events found", async () => {
      const mockFind = {
        lean: jest.fn().mockResolvedValue([]),
      };

      jest
        .spyOn(mockContractEventModel, "find")
        .mockReturnValue(
          mockFind as unknown as ReturnType<typeof mockContractEventModel.find>,
        );

      const result = await service.findManyByIds(["nonexistent"]);

      expect(result).toEqual([]);
    });
  });

  describe("create", () => {
    it("should create a contract event", async () => {
      const mockDto: CreateContractEventRequestDto = {
        date: new Date(),
        reason: "Test reason",
        type: ContractEventType.HIRED,
      };

      const result = await service.create(mockDto);

      expect(result).toBeDefined();
      expect(result).toEqual({ _id: "1", ...mockDto });
    });
  });

  describe("update", () => {
    it("should update a contract event", async () => {
      const mockUpdateDto = {
        type: ContractEventType.FIRED,
        date: new Date(),
        reason: "Updated reason",
      };

      const mockFindByIdAndUpdate = {
        lean: jest.fn().mockResolvedValue({ _id: "1", ...mockUpdateDto }),
      };

      jest
        .spyOn(mockContractEventModel, "findByIdAndUpdate")
        .mockReturnValue(
          mockFindByIdAndUpdate as unknown as ReturnType<
            typeof mockContractEventModel.findByIdAndUpdate
          >,
        );

      const result = await service.update("1", mockUpdateDto);

      expect(result).toBeDefined();
      expect(result._id).toEqual("1");
      expect(result.type).toEqual(mockUpdateDto.type);
    });

    it("should throw NotFoundException if contract event not found for update", async () => {
      const mockFindByIdAndUpdate = {
        lean: jest.fn().mockResolvedValue(null),
      };

      jest
        .spyOn(mockContractEventModel, "findByIdAndUpdate")
        .mockReturnValue(
          mockFindByIdAndUpdate as unknown as ReturnType<
            typeof mockContractEventModel.findByIdAndUpdate
          >,
        );

      await expect(
        service.update("nonexistent", {
          type: ContractEventType.FIRED,
          date: new Date(),
          reason: "Updated reason",
        }),
      ).rejects.toThrow("ContractEvent with id nonexistent not found");
    });
  });

  describe("delete", () => {
    it("should delete a contract event", async () => {
      const mockFindByIdAndDelete = {
        lean: jest.fn().mockResolvedValue({ _id: "1" }),
      };

      jest
        .spyOn(mockContractEventModel, "findByIdAndDelete")
        .mockReturnValue(
          mockFindByIdAndDelete as unknown as ReturnType<
            typeof mockContractEventModel.findByIdAndDelete
          >,
        );

      const result = await service.delete("1");

      expect(result).toBeDefined();
      expect(result.id).toEqual("1");
    });

    it("should throw NotFoundException if contract event not found for deletion", async () => {
      const mockFindByIdAndDelete = {
        lean: jest.fn().mockResolvedValue(null),
      };

      jest
        .spyOn(mockContractEventModel, "findByIdAndDelete")
        .mockReturnValue(
          mockFindByIdAndDelete as unknown as ReturnType<
            typeof mockContractEventModel.findByIdAndDelete
          >,
        );

      await expect(service.delete("nonexistent")).rejects.toThrow(
        "ContractEvent with id nonexistent not found",
      );
    });
  });
});
