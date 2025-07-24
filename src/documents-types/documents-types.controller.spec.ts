import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { DocumentsTypesController } from "./documents-types.controller";
import { DocumentsTypesService } from "./documents-types.service";

describe("DocumentsTypesController", () => {
  let controller: DocumentsTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsTypesController],
      providers: [DocumentsTypesService],
    }).compile();

    controller = module.get<DocumentsTypesController>(DocumentsTypesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
