import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { Connection } from "mongoose";
import { Types } from "mongoose";
import type { AuthPayload } from "src/common/types";
import { MongooseProvider } from "src/configs/mongoose-provider";
import { ContractEventsService } from "src/contract-events/providers/contract-events.service";

import type {
  FireEmployeeRequestDto,
  ReHireEmployeeRequestDto,
} from "../dto/request/action-reason-employee.dto";
import { ContractStatus, EmployeeRole } from "../schemas/employee.schema";
import { EmployeesService } from "./employees.service";
import { HumanResourcesService } from "./human-resources.service";

describe("HumanResourcesService", () => {
  let service: HumanResourcesService;

  const mockEmployeesService = {
    findById: jest.fn(),
  };

  const mockContractEventsService = {
    create: jest.fn(),
  };

  const mockGenericObjectId = new Types.ObjectId("507f1f77bcf86cd799439011");

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

  describe("fire", () => {
    it("should fire an employee by id", async () => {
      const mockEmployee = {
        contractEvents: [
          {
            _id: "event1",
          },
        ],
      };

      mockEmployeesService.findById = jest.fn().mockResolvedValue({
        ...mockEmployee,
        save: jest.fn().mockResolvedValue(true),
      });

      const fireEmployeeDto: FireEmployeeRequestDto = {
        reason: "Performance issues",
      };

      const mockAuthPayload: AuthPayload = {
        sub: new Types.ObjectId("60c72b2f9b1e8d001c8e4f1a").toString(),
        username: "admin",
        role: EmployeeRole.ADMIN,
        contractStatus: ContractStatus.ACTIVE,
      };

      const result = await service.fire(
        mockGenericObjectId,
        fireEmployeeDto,
        mockAuthPayload,
      );

      expect(result).toEqual({
        reason: fireEmployeeDto.reason,
        message: `Successfully terminated contract for employee with id ${mockGenericObjectId.toString()}`,
      });
      expect(mockEmployeesService.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe("reHire", () => {
    it("should rehire an employee by id", async () => {
      const mockEmployee = {
        contractEvents: [
          {
            _id: "event1",
            type: "hire",
            reason: "Initial hire",
          },
          {
            _id: "event2",
            type: "fire",
            reason: "Performance issues",
          },
        ],
      };

      mockEmployeesService.findById = jest.fn().mockResolvedValue({
        ...mockEmployee,
        save: jest.fn().mockResolvedValue(true),
      });

      const mockAuthPayload: AuthPayload = {
        sub: new Types.ObjectId("60c72b2f9b1e8d001c8e4f1a").toString(),
        username: "admin",
        role: EmployeeRole.ADMIN,
        contractStatus: ContractStatus.ACTIVE,
      };

      const employeeId = mockGenericObjectId;

      const reHireEmployeeDto: ReHireEmployeeRequestDto = {
        reason: "Rehired for new project",
      };

      const result = await service.reHire(
        employeeId,
        reHireEmployeeDto,
        mockAuthPayload,
      );

      expect(result).toEqual({
        message: `Successfully rehired employee with id ${employeeId.toString()}`,
        reason: reHireEmployeeDto.reason,
      });
      expect(mockEmployeesService.findById).toHaveBeenCalledTimes(1);
    });
  });
});
