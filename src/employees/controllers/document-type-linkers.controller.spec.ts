import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { DocumentTypeLinkersController } from "./document-type-linkers.controller";

describe("DocumentTypeLinkersController", () => {
  let controller: DocumentTypeLinkersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentTypeLinkersController],
    }).compile();

    controller = module.get<DocumentTypeLinkersController>(
      DocumentTypeLinkersController,
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
