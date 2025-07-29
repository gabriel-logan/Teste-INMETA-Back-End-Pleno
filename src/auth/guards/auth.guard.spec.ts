import { type ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import envTests from "src/configs/env.tests";
import {
  ContractStatus,
  EmployeeRole,
} from "src/employees/schemas/employee.schema";

import { AuthGuard } from "./auth.guard";

describe("AuthGuard", () => {
  let guard: AuthGuard;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: "test",
        }),
        ConfigModule.forFeature(envTests),
      ],
      providers: [AuthGuard],
    }).compile();

    guard = moduleRef.get<AuthGuard>(AuthGuard);
  });

  it("should be defined", () => {
    expect(guard).toBeDefined();
  });

  it("should return true if public decorator is used", async () => {
    jest.spyOn(guard["reflector"], "getAllAndOverride").mockReturnValue(true);

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        getRequest: () => ({
          headers: {
            authorization: "Bearer token",
          },
        }),
      }),
    } as unknown as ExecutionContext;

    expect(await guard.canActivate(context)).toBe(true);
  });

  it("should throw UnauthorizedException if no token is provided", async () => {
    jest.spyOn(guard["reflector"], "getAllAndOverride").mockReturnValue(false);

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        getRequest: () => ({
          headers: {},
        }),
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(guard.canActivate(context)).rejects.toThrow(
      "No token provided",
    );
  });

  it("should throw UnauthorizedException if token is invalid", async () => {
    jest.spyOn(guard["reflector"], "getAllAndOverride").mockReturnValue(false);

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        getRequest: () => ({
          headers: {
            authorization: "Bearer invalidToken",
          },
        }),
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(guard.canActivate(context)).rejects.toThrow(
      "Token is invalid or expired",
    );
  });

  it("should throw UnauthorizedException if contract status is not active", async () => {
    jest.spyOn(guard["reflector"], "getAllAndOverride").mockReturnValue(false);

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        getRequest: () => ({
          headers: {
            authorization: "Bearer validToken",
          },
        }),
      }),
    } as unknown as ExecutionContext;

    const mockPayload = {
      contractStatus: ContractStatus.INACTIVE,
    };

    jest
      .spyOn(guard["jwtService"], "verifyAsync")
      .mockResolvedValue(mockPayload);

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(guard.canActivate(context)).rejects.toThrow(
      "Contract status is not active",
    );
  });

  it("should set employee in request if token is valid", async () => {
    jest.spyOn(guard["reflector"], "getAllAndOverride").mockReturnValue(false);

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        getRequest: () => ({
          headers: {
            authorization: "Bearer validToken",
          },
        }),
      }),
    } as unknown as ExecutionContext;

    const mockPayload = { id: "123", role: EmployeeRole.ADMIN };

    jest
      .spyOn(guard["jwtService"], "verifyAsync")
      .mockResolvedValue(mockPayload);

    expect(await guard.canActivate(context)).toBe(true);
  });
});
