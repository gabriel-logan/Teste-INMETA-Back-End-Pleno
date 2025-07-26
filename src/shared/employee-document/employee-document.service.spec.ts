import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { EmployeeDocumentService } from "./employee-document.service";

describe("EmployeeDocumentService", () => {
  let service: EmployeeDocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeDocumentService],
    }).compile();

    service = module.get<EmployeeDocumentService>(EmployeeDocumentService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
