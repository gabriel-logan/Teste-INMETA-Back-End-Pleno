import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { Types } from "mongoose";

import { ContractEventsService } from "../providers/contract-events.service";
import { ContractEventsController } from "./contract-events.controller";

describe("ContractEventsController", () => {
  let controller: ContractEventsController;

  const mockContractEventsService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findAllByEmployeeCpf: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractEventsController],
      providers: [ContractEventsService],
    })
      .overrideProvider(ContractEventsService)
      .useValue(mockContractEventsService)
      .compile();

    controller = module.get<ContractEventsController>(ContractEventsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("findAll", () => {
    it("should return all contract events", async () => {
      const mockEvents = [{ id: "1" }, { id: "2" }];
      mockContractEventsService.findAll.mockResolvedValue(mockEvents);

      const result = await controller.findAll();

      expect(result).toEqual(mockEvents);
      expect(mockContractEventsService.findAll).toHaveBeenCalled();
    });

    it("should return contract events filtered by employeeCpf", async () => {
      const mockEvents = [{ id: "1" }];
      const employeeCpf = "12345678900";
      mockContractEventsService.findAllByEmployeeCpf.mockResolvedValue(
        mockEvents,
      );

      const result = await controller.findAll(employeeCpf);

      expect(result).toEqual(mockEvents);
      expect(
        mockContractEventsService.findAllByEmployeeCpf,
      ).toHaveBeenCalledWith(employeeCpf);
    });
  });

  describe("findById", () => {
    it("should return a contract event by id", async () => {
      const mockEvent = { id: "1" };
      const contractEventId = new Types.ObjectId("60c72b2f9b1e8b001c8e4d3a");
      mockContractEventsService.findById.mockResolvedValue(mockEvent);

      const result = await controller.findById(contractEventId);

      expect(result).toEqual(mockEvent);
      expect(mockContractEventsService.findById).toHaveBeenCalledWith(
        contractEventId,
      );
    });
    it("should throw an error if contract event not found", async () => {
      const contractEventId = new Types.ObjectId("60c72b2f9b1e8b001c8e4d3a");
      mockContractEventsService.findById.mockRejectedValue(
        new Error(
          `ContractEvent with id ${contractEventId.toString()} not found`,
        ),
      );

      await expect(controller.findById(contractEventId)).rejects.toThrow(
        `ContractEvent with id ${contractEventId.toString()} not found`,
      );
      expect(mockContractEventsService.findById).toHaveBeenCalledWith(
        contractEventId,
      );
    });
  });
});
