import type { ExecutionContext } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { RolesGuard } from "./roles.guard";

describe("RolesGuard", () => {
  let guard: RolesGuard;

  beforeEach(async () => {
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

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: (): (() => object) => jest.fn(),
      }),
    } as unknown as ExecutionContext;

    expect(guard.canActivate(context)).toBe(true);
  });

  it("should return false if employee is not present in request", () => {
    jest
      .spyOn(guard["reflector"], "getAllAndOverride")
      .mockReturnValue(["admin"]);

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: (): (() => object) => jest.fn(),
      }),
    } as unknown as ExecutionContext;

    expect(guard.canActivate(context)).toBe(false);
  });

  it("should return true if employee has at least one required role", () => {
    jest
      .spyOn(guard["reflector"], "getAllAndOverride")
      .mockReturnValue(["admin", "manager"]);

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        getRequest: () => ({
          employee: {
            role: ["user", "admin"],
          },
        }),
      }),
    } as unknown as ExecutionContext;

    expect(guard.canActivate(context)).toBe(true);
  });

  it("should return false if employee does not have any required roles", () => {
    jest
      .spyOn(guard["reflector"], "getAllAndOverride")
      .mockReturnValue(["admin", "manager"]);

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        getRequest: () => ({
          employee: {
            role: ["user"],
          },
        }),
      }),
    } as unknown as ExecutionContext;

    expect(guard.canActivate(context)).toBe(false);
  });
});
