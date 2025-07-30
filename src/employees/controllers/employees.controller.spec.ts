import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { Types } from "mongoose";

import type { CreateEmployeeRequestDto } from "../dto/request/create-employee.dto";
import type { UpdateEmployeeRequestDto } from "../dto/request/update-employee.dto";
import { EmployeesService } from "../providers/employees.service";
import { ContractStatus } from "../schemas/employee.schema";
import { EmployeesController } from "./employees.controller";

describe("EmployeesController", () => {
  let controller: EmployeesController;

  const mockEmployeesService = {
    findAllWithDocumentTypes: jest.fn(() => Promise.resolve([])),
    findByIdWithDocumentTypes: jest.fn((id: string) =>
      Promise.resolve({
        id,
        firstName: "John",
        lastName: "Doe",
        fullName: "John Doe",
        contractStatus: ContractStatus.ACTIVE,
        documentTypes: [],
        cpf: "123.456.789-00",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ),
    findByIdWithContractEvents: jest.fn((id: string) =>
      Promise.resolve({
        id,
        firstName: "John",
        lastName: "Doe",
        fullName: "John Doe",
        contractStatus: ContractStatus.ACTIVE,
        documentTypes: [],
        cpf: "123.456.789-00",
        createdAt: new Date(),
        updatedAt: new Date(),
        contractEvents: [
          {
            id: "60c72b2f9b1e8c001c8f8e1d",
            type: "CONTRACT_SIGNED",
            date: new Date(),
          },
        ],
      }),
    ),
    create: jest.fn((dto: CreateEmployeeRequestDto) =>
      Promise.resolve({
        id: "60c72b2f9b1e8c001c8f8e1d",
        firstName: dto.firstName,
        lastName: dto.lastName,
        fullName: `${dto.firstName} ${dto.lastName}`,
        contractStatus: ContractStatus.ACTIVE,
        documentTypes: [],
        cpf: dto.cpf,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ),
    update: jest.fn((id: string, dto: UpdateEmployeeRequestDto) =>
      Promise.resolve({
        id,
        firstName: dto.firstName,
        lastName: dto.lastName,
        fullName: `${dto.firstName} ${dto.lastName}`,
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
      controllers: [EmployeesController],
      providers: [EmployeesService],
    })
      .overrideProvider(EmployeesService)
      .useValue(mockEmployeesService)
      .compile();

    controller = module.get<EmployeesController>(EmployeesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("findAll", () => {
    it("should return an array of employees", async () => {
      const result = await controller.findAllWithDocumentTypes();

      expect(result).toEqual([]);
      expect(mockEmployeesService.findAllWithDocumentTypes).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("should return a single employee", async () => {
      const id = new Types.ObjectId("60c72b2f9b1e8c001c8f8e1d");
      const result = await controller.findByIdWithDocumentTypes(id);

      expect(result).toEqual({
        id,
        firstName: "John",
        lastName: "Doe",
        fullName: "John Doe",
        contractStatus: ContractStatus.ACTIVE,
        documentTypes: [],
        cpf: "123.456.789-00",
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });
      expect(
        mockEmployeesService.findByIdWithDocumentTypes,
      ).toHaveBeenCalledWith(id);
    });
  });

  describe("findByIdWithContractEvents", () => {
    it("should return a single employee with contract events", async () => {
      const id = new Types.ObjectId("60c72b2f9b1e8c001c8f8e1d");
      const result = await controller.findByIdWithContractEvents(id);

      expect(result).toEqual({
        id,
        firstName: "John",
        lastName: "Doe",
        fullName: "John Doe",
        contractStatus: ContractStatus.ACTIVE,
        documentTypes: [],
        cpf: "123.456.789-00",
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
        contractEvents: [
          {
            id: "60c72b2f9b1e8c001c8f8e1d",
            type: "CONTRACT_SIGNED",
            date: expect.any(Date) as Date,
          },
        ],
      });
      expect(
        mockEmployeesService.findByIdWithContractEvents,
      ).toHaveBeenCalledWith(id);
    });
  });

  describe("create", () => {
    it("should create a new employee", async () => {
      const dto: CreateEmployeeRequestDto = {
        firstName: "Jane",
        lastName: "Doe",
        cpf: "987.654.321-00",
        password: "securePassword",
      };
      const result = await controller.create(dto);

      expect(result).toEqual({
        id: expect.any(String) as string,
        firstName: "Jane",
        lastName: "Doe",
        fullName: "Jane Doe",
        contractStatus: ContractStatus.ACTIVE,
        documentTypes: [],
        cpf: "987.654.321-00",
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });
      expect(mockEmployeesService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe("update", () => {
    it("should update an existing employee", async () => {
      const dto: UpdateEmployeeRequestDto = {
        firstName: "Jane",
        lastName: "Doe",
        cpf: "987.654.321-00",
      };

      const id = new Types.ObjectId("60c72b2f9b1e8c001c8f8e1d");

      const result = await controller.update(id, dto);

      expect(result).toEqual({
        id,
        firstName: "Jane",
        lastName: "Doe",
        fullName: "Jane Doe",
        contractStatus: ContractStatus.ACTIVE,
        documentTypes: [],
        cpf: "987.654.321-00",
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });
      expect(mockEmployeesService.update).toHaveBeenCalledWith(id, dto);
    });
  });
});
