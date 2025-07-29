import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { DocumentFilesService } from "./document-files.service";

describe("DocumentFilesService", () => {
  let service: DocumentFilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentFilesService],
    }).compile();

    service = module.get<DocumentFilesService>(DocumentFilesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
