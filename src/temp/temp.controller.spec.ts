import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { TempController } from "./temp.controller";
import { TempService } from "./temp.service";

describe("TempController", () => {
  let controller: TempController;

  const mockGetTemporary = {
    message: "Temporary endpoint response",
    paramValue: 1,
  };

  const mockTempService = {
    getTemporary: jest.fn(() => mockGetTemporary),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TempController],
      providers: [TempService],
    })
      .overrideProvider(TempService)
      .useValue(mockTempService)
      .compile();

    controller = module.get<TempController>(TempController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should return temporary data", async () => {
    const result: unknown = await controller.getTemporary(1);

    expect(result).toEqual(mockGetTemporary);

    expect(mockTempService.getTemporary).toHaveBeenCalledWith(1);
  });
});
