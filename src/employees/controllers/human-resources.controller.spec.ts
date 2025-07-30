import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { Types } from "mongoose";
import type { AuthPayload } from "src/common/types";

import type {
  FireEmployeeRequestDto,
  ReHireEmployeeRequestDto,
} from "../dto/request/action-reason-employee.dto";
import { HumanResourcesService } from "../providers/human-resources.service";
import { ContractStatus, EmployeeRole } from "../schemas/employee.schema";
import { HumanResourcesController } from "./human-resources.controller";

describe("HumanResourcesController", () => {
  let controller: HumanResourcesController;

  const mockHumanResourcesService = {
    fire: jest.fn(
      (employeeId: string, fireEmployeeDto: FireEmployeeRequestDto) =>
        Promise.resolve({
          reason: fireEmployeeDto.reason,
          message: `Successfully terminated contract for employee with id ${employeeId}`,
        }),
    ),
    reHire: jest.fn(
      (employeeId: string, reHireEmployeeDto: ReHireEmployeeRequestDto) =>
        Promise.resolve({
          reason: reHireEmployeeDto.reason,
          message: `Successfully rehired employee with id ${employeeId}`,
        }),
    ),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HumanResourcesController],
      providers: [HumanResourcesService],
    })
      .overrideProvider(HumanResourcesService)
      .useValue(mockHumanResourcesService)
      .compile();

    controller = module.get<HumanResourcesController>(HumanResourcesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("fire", () => {
    it("should fire an employee", async () => {
      const dto: FireEmployeeRequestDto = { reason: "Performance issues" };

      const fakeAuthPayload: AuthPayload = {
        sub: new Types.ObjectId("60c11b2f9b1e8c001c8f8e1d").toString(),
        role: EmployeeRole.ADMIN,
        username: "adminUser",
        contractStatus: ContractStatus.ACTIVE,
      };

      const id = new Types.ObjectId("60c72b2f9b1e8c001c8f8e1d");

      const result = await controller.fire(id, dto, fakeAuthPayload);

      expect(result).toEqual({
        reason: "Performance issues",
        message:
          "Successfully terminated contract for employee with id 60c72b2f9b1e8c001c8f8e1d",
      });
      expect(mockHumanResourcesService.fire).toHaveBeenCalledWith(
        id,
        dto,
        fakeAuthPayload,
      );
    });
  });

  describe("reHire", () => {
    it("should rehire an employee", async () => {
      const dto: ReHireEmployeeRequestDto = { reason: "Business needs" };

      const fakeAuthPayload: AuthPayload = {
        sub: new Types.ObjectId("60c11b2f9b1e8c001c8f8e1d").toString(),
        role: EmployeeRole.ADMIN,
        username: "adminUser",
        contractStatus: ContractStatus.ACTIVE,
      };

      const id = new Types.ObjectId("60c72b2f9b1e8c001c8f8e1d");

      const result = await controller.reHire(id, dto, fakeAuthPayload);

      expect(result).toEqual({
        reason: "Business needs",
        message:
          "Successfully rehired employee with id 60c72b2f9b1e8c001c8f8e1d",
      });
      expect(mockHumanResourcesService.reHire).toHaveBeenCalledWith(
        id,
        dto,
        fakeAuthPayload,
      );
    });
  });
});
