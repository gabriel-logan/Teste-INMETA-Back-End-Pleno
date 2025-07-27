import { JwtModule } from "@nestjs/jwt";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { EmployeesService } from "src/employees/providers/employees.service";

import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let service: AuthService;

  const mockEmployeesService = {};

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
});
