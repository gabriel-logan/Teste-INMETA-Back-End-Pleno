import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { AdminEmployeesController } from "./admin-employees.controller";

describe("AdminEmployeesController", () => {
  let controller: AdminEmployeesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminEmployeesController],
    }).compile();

    controller = module.get<AdminEmployeesController>(AdminEmployeesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("createAdminEmployee", () => {
    it("should create a new admin employee", async () => {
      const dto: CreateAdminEmployeeRequestDto = {
        firstName: "Admin",
        lastName: "User",
        username: "adminUser",
        cpf: "123.456.789-00",
        password: "securePassword",
      };
      const result = await controller.createAdminEmployee(dto);

      expect(result).toEqual({
        id: expect.any(String) as string,
        firstName: "Admin",
        lastName: "User",
        fullName: "Admin User",
        username: "adminUser",
        role: EmployeeRole.ADMIN,
        contractStatus: ContractStatus.ACTIVE,
        documentTypes: [],
        cpf: "123.456.789-00",
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });
      expect(mockEmployeesService.createAdminEmployee).toHaveBeenCalledWith(
        dto,
      );
    });
  });
});
