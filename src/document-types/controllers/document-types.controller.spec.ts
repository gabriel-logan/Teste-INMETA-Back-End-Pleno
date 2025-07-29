import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { Types } from "mongoose";

import type { CreateDocumentTypeRequestDto } from "../dto/request/create-document-type.dto";
import { DocumentTypesService } from "../providers/document-types.service";
import { DocumentTypeAllowedValues } from "../schemas/document-type.schema";
import { DocumentTypesController } from "./document-types.controller";

const mockGenericObjectId = new Types.ObjectId("60c72b2f9b1e8b001c8e4d3a");

describe("DocumentTypesController", () => {
  let controller: DocumentTypesController;

  const mockDocumentTypesService = {
    findAll: jest.fn(() => Promise.resolve([])),
    findById: jest.fn((id: Types.ObjectId) =>
      Promise.resolve({
        id,
        name: "Mocked Document Type",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ),
    findOneByName: jest.fn((name: string) =>
      Promise.resolve({
        id: "mocked-id",
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ),
    create: jest.fn((dto: CreateDocumentTypeRequestDto) =>
      Promise.resolve({
        id: "mocked-id",
        name: dto.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ),
    update: jest.fn((id: Types.ObjectId, dto: CreateDocumentTypeRequestDto) =>
      Promise.resolve({
        id,
        name: dto.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ),
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
  });

  describe("findById", () => {
    it("should return a document type by id", async () => {
      const result = await controller.findById(mockGenericObjectId);

      expect(result).toEqual({
        id: mockGenericObjectId,
        name: "Mocked Document Type",
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });

      expect(mockDocumentTypesService.findById).toHaveBeenCalledWith(
        mockGenericObjectId,
      );
    });
  });

  describe("findOneByName", () => {
    it("should return a document type by name", async () => {
      const name = "Mocked Document Type";
      const result = await controller.findOneByName(name);

      expect(result).toEqual({
        id: "mocked-id",
        name,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });

      expect(mockDocumentTypesService.findOneByName).toHaveBeenCalledWith(name);
    });
  });

  describe("create", () => {
    it("should create a new document type", async () => {
      const createDto: CreateDocumentTypeRequestDto = {
        name: DocumentTypeAllowedValues.CNPJ,
      };
      const result = await controller.create(createDto);

      expect(result).toEqual({
        id: "mocked-id",
        name: createDto.name,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });

      expect(mockDocumentTypesService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe("update", () => {
    it("should update an existing document type", async () => {
      const updateDto: CreateDocumentTypeRequestDto = {
        name: DocumentTypeAllowedValues.CPF,
      };
      const result = await controller.update(mockGenericObjectId, updateDto);

      expect(result).toEqual({
        id: mockGenericObjectId,
        name: updateDto.name,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });

      expect(mockDocumentTypesService.update).toHaveBeenCalledWith(
        mockGenericObjectId,
        updateDto,
      );
    });
  });
});
