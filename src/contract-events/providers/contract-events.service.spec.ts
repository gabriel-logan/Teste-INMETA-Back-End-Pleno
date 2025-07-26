import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { ContractEventsService } from "./contract-events.service";

describe("ContractEventsService", () => {
  let service: ContractEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractEventsService],
    }).compile();

    service = module.get<ContractEventsService>(ContractEventsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
