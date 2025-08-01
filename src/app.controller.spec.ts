import { Logger } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { Request } from "express";

import { AppController } from "./app.controller";

describe("AppController", () => {
  let appController: AppController;

  beforeAll(() => {
    jest.spyOn(Logger.prototype, "error").mockImplementation(() => {});
    jest.spyOn(Logger.prototype, "warn").mockImplementation(() => {});
    jest.spyOn(Logger.prototype, "log").mockImplementation(() => {});
    jest.spyOn(Logger.prototype, "debug").mockImplementation(() => {});
  });

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("root", () => {
    it('should return "Hello World!"', () => {
      const mockReq1 = {
        ip: "127.0.0.1",
        headers: {
          "user-agent": "test-agent",
          accept: "application/json",
        },
      } as Request;

      const mockReq2 = {
        ip: undefined,
        headers: {
          "user-agent": undefined,
          accept: undefined,
        },
      } as Request;

      const mockReq3 = {
        ip: "a".repeat(46), // Exceeding max length for IPv6
        headers: {
          "user-agent": "a".repeat(301),
          accept: "b".repeat(301),
        },
      } as Request;

      expect(appController.getHello(mockReq1)).toBe("Hello World!");
      expect(appController.getHello(mockReq2)).toBe("Hello World!");
      expect(appController.getHello(mockReq3)).toBe("Hello World!");
    });
  });
});
