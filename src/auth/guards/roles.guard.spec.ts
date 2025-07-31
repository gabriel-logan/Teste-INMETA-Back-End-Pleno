import type { ExecutionContext } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { RolesGuard } from "./roles.guard";

describe("RolesGuard", () => {
  let guard: RolesGuard;
  let mockContext: ExecutionContext;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: (): (() => object) => jest.fn(),
      }),
    } as unknown as ExecutionContext;

    const moduleRef = await Test.createTestingModule({
      providers: [RolesGuard],
    }).compile();

    guard = moduleRef.get<RolesGuard>(RolesGuard);
  });

  it("should be defined", () => {
    expect(guard).toBeDefined();
  });

  it("should return true if no required roles are set", () => {
    jest
      .spyOn(guard["reflector"], "getAllAndOverride")
      .mockReturnValue(undefined);

    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it("should return false if employee is not present in request", () => {
    jest
      .spyOn(guard["reflector"], "getAllAndOverride")
      .mockReturnValue(["admin"]);

    expect(guard.canActivate(mockContext)).toBe(false);
  });

  it("should return true if employee has at least one required role", () => {
    jest
      .spyOn(guard["reflector"], "getAllAndOverride")
      .mockReturnValue(["admin", "manager"]);

    mockContext.switchToHttp = (): any => ({
      getRequest: () => ({
        employee: {
          role: ["admin"],
        },
      }),
    });

    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it("should return false if employee does not have any required roles", () => {
    jest
      .spyOn(guard["reflector"], "getAllAndOverride")
      .mockReturnValue(["admin", "manager"]);

    mockContext.switchToHttp = (): any => ({
      getRequest: () => ({
        employee: {
          role: ["user"],
        },
      }),
    });

    expect(guard.canActivate(mockContext)).toBe(false);
  });
});
