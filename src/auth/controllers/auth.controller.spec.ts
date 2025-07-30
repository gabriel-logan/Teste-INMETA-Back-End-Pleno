import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { AuthService } from "../providers/auth.service";
import { AuthController } from "./auth.controller";

describe("AuthController", () => {
  let controller: AuthController;

  const mockAuthService = {
    signIn: jest.fn().mockResolvedValue({
      accessToken: "mockedAccessToken",
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("signIn", () => {
    it("should return an access token", async () => {
      const createAuthDto = { username: "testUser", password: "testPass" };

      const result = await controller.signIn(createAuthDto);

      expect(result).toEqual({ accessToken: "mockedAccessToken" });
      expect(mockAuthService.signIn).toHaveBeenCalledWith(createAuthDto);
    });
  });
});
