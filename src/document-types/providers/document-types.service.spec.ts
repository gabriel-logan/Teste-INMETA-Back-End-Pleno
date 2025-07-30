import { CacheModule } from "@nestjs/cache-manager";
import { getModelToken } from "@nestjs/mongoose";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { Model, Types } from "mongoose";

import type { CreateDocumentTypeRequestDto } from "../dto/request/create-document-type.dto";
import type { UpdateDocumentTypeRequestDto } from "../dto/request/update-document-type.dto";
import {
  DocumentType,
  DocumentTypeAllowedValues,
} from "../schemas/document-type.schema";
import { DocumentTypesService } from "./document-types.service";

describe("DocumentTypesService", () => {
  let service: DocumentTypesService;

  const mockGenericObjectId = new Types.ObjectId("60c72b2f9b1e8b001c8e4d3a");

  const mockDefaultDocumentType = {
    _id: mockGenericObjectId,
    name: "Test Document Type",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSave = jest.fn(function (this: any) {
    return Promise.resolve({ ...this });
  });

  const mockDocumentTypeModel = jest.fn().mockImplementation(
    (data) =>
      ({
        ...mockDefaultDocumentType,
        ...data,
        save: mockSave,
      }) as Model<DocumentType>,
  ) as unknown as typeof Model & {
    find: jest.Mock;
    findById: jest.Mock;
    findOne: jest.Mock;
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    mockDocumentTypeModel.find = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue([mockDefaultDocumentType]),
    });

    mockDocumentTypeModel.findById = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockDefaultDocumentType),
    });

    mockDocumentTypeModel.findOne = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockDefaultDocumentType),
    });

    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        DocumentTypesService,
        {
          provide: getModelToken(DocumentType.name),
          useValue: Model,
        },
      ],
    })
      .overrideProvider(getModelToken(DocumentType.name))
      .useValue(mockDocumentTypeModel)
      .compile();

    service = module.get<DocumentTypesService>(DocumentTypesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return an array of document types", async () => {
      const result = await service.findAll();

      expect(result).toEqual([
        {
          _id: mockDefaultDocumentType._id,
          id: mockDefaultDocumentType._id.toString(),
          name: mockDefaultDocumentType.name,
          createdAt: mockDefaultDocumentType.createdAt,
          updatedAt: mockDefaultDocumentType.updatedAt,
        },
      ]);
      expect(mockDocumentTypeModel.find).toHaveBeenCalledTimes(1);
    });
  });

  describe("findById", () => {
    it("should return a document type by id", async () => {
      const result = await service.findById(mockDefaultDocumentType._id);

      expect(result).toEqual({
        _id: mockDefaultDocumentType._id,
        id: mockDefaultDocumentType._id.toString(),
        name: mockDefaultDocumentType.name,
        createdAt: mockDefaultDocumentType.createdAt,
        updatedAt: mockDefaultDocumentType.updatedAt,
      });
      expect(mockDocumentTypeModel.findById).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if document type not found", async () => {
      mockDocumentTypeModel.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.findById(mockDefaultDocumentType._id),
      ).rejects.toThrow(
        "DocumentType with id 60c72b2f9b1e8b001c8e4d3a not found",
      );
      expect(mockDocumentTypeModel.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe("findOneByName", () => {
    it("should return a document type by name", async () => {
      const result = await service.findOneByName(mockDefaultDocumentType.name);

      expect(result).toEqual({
        _id: mockDefaultDocumentType._id,
        id: mockDefaultDocumentType._id.toString(),
        name: mockDefaultDocumentType.name,
        createdAt: mockDefaultDocumentType.createdAt,
        updatedAt: mockDefaultDocumentType.updatedAt,
      });
      expect(mockDocumentTypeModel.findOne).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if document type not found", async () => {
      mockDocumentTypeModel.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.findOneByName(mockDefaultDocumentType.name),
      ).rejects.toThrow(
        `DocumentType with name ${mockDefaultDocumentType.name} not found`,
      );
      expect(mockDocumentTypeModel.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe("create", () => {
    it("should create a new document type", async () => {
      const createDocumentTypeDto: CreateDocumentTypeRequestDto = {
        name: DocumentTypeAllowedValues.RG,
      };

      const result = await service.create(createDocumentTypeDto);

      expect(result).toBeDefined();
      expect(result).toEqual({
        _id: expect.any(Types.ObjectId) as Types.ObjectId,
        id: mockDefaultDocumentType._id.toString(),
        name: createDocumentTypeDto.name,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });
    });
  });

  describe("update", () => {
    it("should update an existing document type", async () => {
      const mockOldDocumentType: Partial<DocumentType> = {
        _id: mockDefaultDocumentType._id,
        name: DocumentTypeAllowedValues.CNPJ,
        createdAt: mockDefaultDocumentType.createdAt,
        updatedAt: mockDefaultDocumentType.updatedAt,
      };

      const updateDocumentTypeDto: UpdateDocumentTypeRequestDto = {
        name: DocumentTypeAllowedValues.RG,
      };

      mockDocumentTypeModel.findById.mockResolvedValue({
        ...mockOldDocumentType,
        save: mockSave,
      });

      const result = await service.update(
        mockDefaultDocumentType._id,
        updateDocumentTypeDto,
      );

      expect(result).toBeDefined();
      expect(result).toEqual({
        _id: mockDefaultDocumentType._id,
        id: mockDefaultDocumentType._id.toString(),
        name: updateDocumentTypeDto.name,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });
      expect(mockDocumentTypeModel.findById).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if document type not found for update", async () => {
      mockDocumentTypeModel.findById.mockResolvedValue(null);

      const updateDocumentTypeDto: UpdateDocumentTypeRequestDto = {
        name: DocumentTypeAllowedValues.RG,
      };

      await expect(
        service.update(mockDefaultDocumentType._id, updateDocumentTypeDto),
      ).rejects.toThrow(
        `DocumentType with id ${mockDefaultDocumentType._id.toString()} not found`,
      );
    });
  });
});
