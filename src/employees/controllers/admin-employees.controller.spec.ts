import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import type { CreateAdminEmployeeRequestDto } from "../dto/request/create-admin-employee.dto";
import { AdminEmployeesService } from "../providers/admin-employees.service";
import { ContractStatus, EmployeeRole } from "../schemas/employee.schema";
import { AdminEmployeesController } from "./admin-employees.controller";

describe("AdminEmployeesController", () => {
  let controller: AdminEmployeesController;

  const mockAdminEmployeesService = {
    createAdminEmployee: jest.fn((dto: CreateAdminEmployeeRequestDto) =>
      Promise.resolve({
        id: "60c72b2f9b1e8c001c8f8e1d",
        firstName: dto.firstName,
        lastName: dto.lastName,
        fullName: `${dto.firstName} ${dto.lastName}`,
        username: dto.username,
        role: EmployeeRole.ADMIN,
        contractStatus: ContractStatus.ACTIVE,
        documentTypes: [],
        cpf: dto.cpf,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminEmployeesController],
      providers: [AdminEmployeesService],
    })
      .overrideProvider(AdminEmployeesService)
      .useValue(mockAdminEmployeesService)
      .compile();

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
      expect(
        mockAdminEmployeesService.createAdminEmployee,
      ).toHaveBeenCalledWith(dto);
    });
  });
});
