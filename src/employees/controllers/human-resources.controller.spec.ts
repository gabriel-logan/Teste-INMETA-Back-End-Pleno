import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { HumanResourcesController } from "./human-resources.controller";

describe("HumanResourcesController", () => {
  let controller: HumanResourcesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HumanResourcesController],
    }).compile();

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
      expect(mockEmployeesService.fire).toHaveBeenCalledWith(
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
      expect(mockEmployeesService.reHire).toHaveBeenCalledWith(
        id,
        dto,
        fakeAuthPayload,
      );
    });
  });
});
