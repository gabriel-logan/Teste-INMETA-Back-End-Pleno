import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { DocumentFilesController } from "./document-files.controller";

describe("DocumentFilesController", () => {
  let controller: DocumentFilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentFilesController],
    }).compile();

    controller = module.get<DocumentFilesController>(DocumentFilesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
