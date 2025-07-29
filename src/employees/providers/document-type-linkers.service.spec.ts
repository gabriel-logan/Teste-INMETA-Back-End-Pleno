import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { DocumentTypeLinkersService } from "./document-type-linkers.service";

describe("DocumentTypeLinkersService", () => {
  let service: DocumentTypeLinkersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentTypeLinkersService],
    }).compile();

    service = module.get<DocumentTypeLinkersService>(
      DocumentTypeLinkersService,
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
