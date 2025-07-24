import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { DocumentTypesService } from "../providers/document-types.service";
import { DocumentTypesController } from "./document-types.controller";

describe("DocumentTypesController", () => {
  let controller: DocumentTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentTypesController],
      providers: [DocumentTypesService],
    }).compile();

    controller = module.get<DocumentTypesController>(DocumentTypesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
