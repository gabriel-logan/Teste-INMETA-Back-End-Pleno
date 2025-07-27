import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { DocumentTypesService } from "../providers/document-types.service";
import { DocumentTypesController } from "./document-types.controller";

describe("DocumentTypesController", () => {
  let controller: DocumentTypesController;

  type DocumentType = {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };

  const mockDocumentTypesService: {
    findAll: jest.Mock<Promise<DocumentType[]>, any>;
    findById: jest.Mock<any, any>;
    findOneByName: jest.Mock<any, any>;
    create: jest.Mock<any, any>;
    update: jest.Mock<any, any>;
  } = {
    findAll: jest.fn(() => Promise.resolve([])),
    findById: jest.fn(() => null),
    findOneByName: jest.fn(() => null),
    create: jest.fn(() => ({
      id: "mocked-id",
      name: "Mocked Document Type",
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    update: jest.fn(() => ({
      id: "mocked-id",
      name: "Updated Document Type",
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentTypesController],
      providers: [DocumentTypesService],
    })
      .overrideProvider(DocumentTypesService)
      .useValue(mockDocumentTypesService)
      .compile();

    controller = module.get<DocumentTypesController>(DocumentTypesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("findAll", () => {
    it("should return an array of document types", async () => {
      const result = await controller.findAll();

      expect(result).toEqual([]);

      expect(mockDocumentTypesService.findAll).toHaveBeenCalled();
    });

    it("should return an array of document types", async () => {
      mockDocumentTypesService.findAll.mockResolvedValueOnce([
        {
          id: "mocked-id",
          name: "Mocked Document Type",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const result = await controller.findAll();

      expect(result).toEqual([
        {
          id: "mocked-id",
          name: "Mocked Document Type",
          createdAt: expect.any(Date) as Date,
          updatedAt: expect.any(Date) as Date,
        },
      ]);

      expect(mockDocumentTypesService.findAll).toHaveBeenCalled();
    });
  });
});
