import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { ContractEventsController } from "./contract-events.controller";

describe("ContractEventsController", () => {
  let controller: ContractEventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractEventsController],
    }).compile();

    controller = module.get<ContractEventsController>(ContractEventsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
