import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { DocumentsTypesService } from "./documents-types.service";

describe("DocumentsTypesService", () => {
  let service: DocumentsTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentsTypesService],
    }).compile();

    service = module.get<DocumentsTypesService>(DocumentsTypesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
