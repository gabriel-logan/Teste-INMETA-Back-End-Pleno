import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { Types } from "mongoose";
import type { AuthPayload } from "src/common/types";

import type {
  FireEmployeeRequestDto,
  ReHireEmployeeRequestDto,
} from "../dto/request/action-reason-employee.dto";
import type { CreateAdminEmployeeRequestDto } from "../dto/request/create-admin-employee.dto";
import type { CreateEmployeeRequestDto } from "../dto/request/create-employee.dto";
import type { LinkDocumentTypesRequestDto } from "../dto/request/link-document-types.dto";
import type { UpdateEmployeeRequestDto } from "../dto/request/update-employee.dto";
import { EmployeesService } from "../providers/employees.service";
import { ContractStatus, EmployeeRole } from "../schemas/employee.schema";
import { EmployeesController } from "./employees.controller";

describe("EmployeesController", () => {
  let controller: EmployeesController;

  const mockEmployeesService = {
    findAll: jest.fn(() => Promise.resolve([])),
    findById: jest.fn((id: string) =>
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
    linkDocumentTypes: jest.fn(
      (_employeeId: string, dto: LinkDocumentTypesRequestDto) =>
        Promise.resolve({
          documentTypeIdsLinked: dto.documentTypeIds,
        }),
    ),
    unlinkDocumentTypes: jest.fn(
      (_employeeId: string, dto: LinkDocumentTypesRequestDto) =>
        Promise.resolve({
          documentTypeIdsUnlinked: dto.documentTypeIds,
        }),
    ),
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
      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(mockEmployeesService.findAll).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("should return a single employee", async () => {
      const result = await controller.findById("60c72b2f9b1e8c001c8f8e1d");

      expect(result).toEqual({
        id: "60c72b2f9b1e8c001c8f8e1d",
        firstName: "John",
        lastName: "Doe",
        fullName: "John Doe",
        contractStatus: ContractStatus.ACTIVE,
        documentTypes: [],
        cpf: "123.456.789-00",
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });
      expect(mockEmployeesService.findById).toHaveBeenCalledWith(
        "60c72b2f9b1e8c001c8f8e1d",
      );
    });
  });

  describe("findByIdWithContractEvents", () => {
    it("should return a single employee with contract events", async () => {
      const result = await controller.findByIdWithContractEvents(
        "60c72b2f9b1e8c001c8f8e1d",
      );

      expect(result).toEqual({
        id: "60c72b2f9b1e8c001c8f8e1d",
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
      ).toHaveBeenCalledWith("60c72b2f9b1e8c001c8f8e1d");
    });
  });

  describe("create", () => {
    it("should create a new employee", async () => {
      const dto: CreateEmployeeRequestDto = {
        firstName: "Jane",
        lastName: "Doe",
        cpf: "987.654.321-00",
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
      const result = await controller.update("60c72b2f9b1e8c001c8f8e1d", dto);

      expect(result).toEqual({
        id: "60c72b2f9b1e8c001c8f8e1d",
        firstName: "Jane",
        lastName: "Doe",
        fullName: "Jane Doe",
        contractStatus: ContractStatus.ACTIVE,
        documentTypes: [],
        cpf: "987.654.321-00",
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });
      expect(mockEmployeesService.update).toHaveBeenCalledWith(
        "60c72b2f9b1e8c001c8f8e1d",
        dto,
      );
    });
  });

  describe("fire", () => {
    it("should fire an employee", async () => {
      const dto: FireEmployeeRequestDto = { reason: "Performance issues" };

      const fakeAuthPayload: AuthPayload = {
        sub: new Types.ObjectId("60c11b2f9b1e8c001c8f8e1d"),
        role: EmployeeRole.ADMIN,
        username: "adminUser",
      };

      const result = await controller.fire(
        "60c72b2f9b1e8c001c8f8e1d",
        dto,
        fakeAuthPayload,
      );

      expect(result).toEqual({
        reason: "Performance issues",
        message:
          "Successfully terminated contract for employee with id 60c72b2f9b1e8c001c8f8e1d",
      });
      expect(mockEmployeesService.fire).toHaveBeenCalledWith(
        "60c72b2f9b1e8c001c8f8e1d",
        dto,
        fakeAuthPayload,
      );
    });
  });

  describe("reHire", () => {
    it("should rehire an employee", async () => {
      const dto: ReHireEmployeeRequestDto = { reason: "Business needs" };

      const fakeAuthPayload: AuthPayload = {
        sub: new Types.ObjectId("60c11b2f9b1e8c001c8f8e1d"),
        role: EmployeeRole.ADMIN,
        username: "adminUser",
      };

      const result = await controller.reHire(
        "60c72b2f9b1e8c001c8f8e1d",
        dto,
        fakeAuthPayload,
      );

      expect(result).toEqual({
        reason: "Business needs",
        message:
          "Successfully rehired employee with id 60c72b2f9b1e8c001c8f8e1d",
      });
      expect(mockEmployeesService.reHire).toHaveBeenCalledWith(
        "60c72b2f9b1e8c001c8f8e1d",
        dto,
        fakeAuthPayload,
      );
    });
  });

  describe("linkDocumentTypes", () => {
    it("should link document types to an employee", async () => {
      const linkDocumentTypesDto: LinkDocumentTypesRequestDto = {
        documentTypeIds: [
          "60c72b2f9b1e8c001c8f8e1d",
          "60c72b2f9b1e8c001c8f8e1e",
        ],
      };
      const result = await controller.linkDocumentTypes(
        "60c72b2f9b1e8c001c8f8e1d",
        linkDocumentTypesDto,
      );

      expect(result).toEqual({
        documentTypeIdsLinked: linkDocumentTypesDto.documentTypeIds,
      });
      expect(mockEmployeesService.linkDocumentTypes).toHaveBeenCalledWith(
        "60c72b2f9b1e8c001c8f8e1d",
        linkDocumentTypesDto,
      );
    });
  });

  describe("unlinkDocumentTypes", () => {
    it("should unlink document types from an employee", async () => {
      const linkDocumentTypesDto: LinkDocumentTypesRequestDto = {
        documentTypeIds: [
          "60c72b2f9b1e8c001c8f8e1d",
          "60c72b2f9b1e8c001c8f8e1e",
        ],
      };
      const result = await controller.unlinkDocumentTypes(
        "60c72b2f9b1e8c001c8f8e1d",
        linkDocumentTypesDto,
      );

      expect(result).toEqual({
        documentTypeIdsUnlinked: linkDocumentTypesDto.documentTypeIds,
      });
      expect(mockEmployeesService.unlinkDocumentTypes).toHaveBeenCalledWith(
        "60c72b2f9b1e8c001c8f8e1d",
        linkDocumentTypesDto,
      );
    });
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
