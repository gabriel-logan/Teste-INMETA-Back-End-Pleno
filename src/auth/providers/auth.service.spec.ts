import { JwtModule } from "@nestjs/jwt";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import * as bcrypt from "bcrypt";
import { Types } from "mongoose";
import { EmployeesService } from "src/employees/providers/employees.service";
import {
  ContractStatus,
  EmployeeRole,
} from "src/employees/schemas/employee.schema";

import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let service: AuthService;

  const mockEmployeesId = new Types.ObjectId("507f1f77bcf86cd799439011");

  const mockEmployeesService = {
    findOneByUsername: jest.fn().mockResolvedValue({
      _id: mockEmployeesId,
      id: mockEmployeesId.toString(),
      username: "testUser",
      password: "hashedPassword",
      role: EmployeeRole.ADMIN,
      contractStatus: ContractStatus.ACTIVE,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: "testSecret",
        }),
      ],
      providers: [AuthService, EmployeesService],
    })
      .overrideProvider(EmployeesService)
      .useValue(mockEmployeesService)
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("signIn", () => {
    it("should return a token", async () => {
      const spyOnBcrypt = jest
        .spyOn(bcrypt, "compare")
        .mockResolvedValue(true as never);

      const result = await service.signIn({
        username: "testUser",
        password: "testPassword",
      });

      expect(result).toHaveProperty("accessToken");
      expect(result.accessToken).toBeDefined();
      expect(result.accessToken).toEqual(expect.any(String));
      expect(spyOnBcrypt).toHaveBeenCalledWith(
        "testPassword",
        "hashedPassword",
      );
      expect(spyOnBcrypt).toHaveBeenCalledTimes(1);
    });

    it("should throw UnauthorizedException for invalid username", async () => {
      jest
        .spyOn(mockEmployeesService, "findOneByUsername")
        .mockRejectedValue(new Error("User not found"));

      await expect(
        service.signIn({
          username: "invalidUser",
          password: "testPassword",
        }),
      ).rejects.toThrow("Invalid username or password");
    });

    it("should throw UnauthorizedException for invalid password", async () => {
      jest.spyOn(mockEmployeesService, "findOneByUsername").mockResolvedValue({
        id: 1,
        username: "testUser",
        password: "hashedPassword",
        role: "user",
      });

      jest.spyOn(bcrypt, "compare").mockResolvedValue(false as never);

      await expect(
        service.signIn({
          username: "invalidUser",
          password: "testPassword",
        }),
      ).rejects.toThrow("Invalid username or password");
    });

    it("should throw UnauthorizedException for inactive contract status", async () => {
      jest.spyOn(mockEmployeesService, "findOneByUsername").mockResolvedValue({
        id: 1,
        username: "testUser",
        password: "hashedPassword",
        role: "user",
        contractStatus: "inactive",
      });

      jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);

      await expect(
        service.signIn({
          username: "testUser",
          password: "testPassword",
        }),
      ).rejects.toThrow("Employee contract is not active, cannot sign in");
    });
  });
});
