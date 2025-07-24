import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { DocumentsService } from "../providers/documents.service";
import { DocumentsController } from "./documents.controller";

describe("DocumentsController", () => {
  let controller: DocumentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [DocumentsService],
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
