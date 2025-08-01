import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { Request } from "express";

import { AppController } from "./app.controller";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("root", () => {
    it('should return "Hello World!"', () => {
      const mockReq = {
        ip: "127.0.0.1",
        headers: {
          "user-agent": "test-agent",
          accept: "application/json",
        },
      } as Request;

      expect(appController.getHello(mockReq)).toBe("Hello World!");
    });
  });
});
