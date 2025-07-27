import { CacheModule } from "@nestjs/cache-manager";
import { getModelToken } from "@nestjs/mongoose";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { Model } from "mongoose";

import type { CreateDocumentTypeRequestDto } from "../dto/request/create-document-type.dto";
import type { UpdateDocumentTypeRequestDto } from "../dto/request/update-document-type.dto";
import {
  DocumentType,
  DocumentTypeAllowedValues,
} from "../schemas/document-type.schema";
import { DocumentTypesService } from "./document-types.service";

describe("DocumentTypesService", () => {
  let service: DocumentTypesService;
  let mockDocumentTypeModel: Model<DocumentType>;

  const mockDocumentType = {
    _id: "1",
    name: "Test Document Type",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockDocumentTypeModelSchema = class {
    private readonly data: any;

    constructor(data?: unknown[]) {
      this.data = {
        _id: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
      };

      this.save = jest.fn().mockResolvedValue(this.data);
    }

    public static readonly find = jest.fn();
    public static readonly findById = jest.fn();
    public static readonly findOne = jest.fn();
    public static readonly findByIdAndUpdate = jest.fn();
    public save = jest.fn();
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        DocumentTypesService,
        {
          provide: getModelToken(DocumentType.name),
          useValue: mockDocumentTypeModelSchema,
        },
      ],
    }).compile();

    service = module.get<DocumentTypesService>(DocumentTypesService);
    mockDocumentTypeModel = module.get<Model<DocumentType>>(
      getModelToken(DocumentType.name),
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return an array of document types", async () => {
      const mockFind = {
        lean: jest.fn().mockResolvedValue([mockDocumentType]),
      };

      const spyFind = jest
        .spyOn(mockDocumentTypeModel, "find")
        .mockReturnValue(
          mockFind as unknown as ReturnType<typeof mockDocumentTypeModel.find>,
        );

      const result = await service.findAll();

      expect(result).toEqual([
        {
          id: mockDocumentType._id,
          name: mockDocumentType.name,
          createdAt: mockDocumentType.createdAt,
          updatedAt: mockDocumentType.updatedAt,
        },
      ]);

      expect(mockFind.lean).toHaveBeenCalled();
      expect(spyFind).toHaveBeenCalledTimes(1);
    });
  });

  describe("findById", () => {
    it("should return a document type by id", async () => {
      const mockFindById = {
        lean: jest.fn().mockResolvedValue(mockDocumentType),
      };

      const spyFindById = jest
        .spyOn(mockDocumentTypeModel, "findById")
        .mockReturnValue(
          mockFindById as unknown as ReturnType<
            typeof mockDocumentTypeModel.findById
          >,
        );

      const result = await service.findById(mockDocumentType._id);

      expect(result).toEqual({
        id: mockDocumentType._id,
        name: mockDocumentType.name,
        createdAt: mockDocumentType.createdAt,
        updatedAt: mockDocumentType.updatedAt,
      });

      expect(mockFindById.lean).toHaveBeenCalled();
      expect(spyFindById).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if document type not found", async () => {
      const mockFindById = {
        lean: jest.fn().mockResolvedValue(null),
      };

      const spyFindById = jest
        .spyOn(mockDocumentTypeModel, "findById")
        .mockReturnValue(
          mockFindById as unknown as ReturnType<
            typeof mockDocumentTypeModel.findById
          >,
        );

      await expect(service.findById(mockDocumentType._id)).rejects.toThrow(
        "DocumentType with id 1 not found",
      );

      expect(mockFindById.lean).toHaveBeenCalled();
      expect(spyFindById).toHaveBeenCalledTimes(1);
    });
  });

  describe("findOneByName", () => {
    it("should return a document type by name", async () => {
      const mockFindOne = {
        lean: jest.fn().mockResolvedValue(mockDocumentType),
      };

      const spyFindOne = jest
        .spyOn(mockDocumentTypeModel, "findOne")
        .mockReturnValue(
          mockFindOne as unknown as ReturnType<
            typeof mockDocumentTypeModel.findOne
          >,
        );

      const result = await service.findOneByName(mockDocumentType.name);

      expect(result).toEqual({
        id: mockDocumentType._id,
        name: mockDocumentType.name,
        createdAt: mockDocumentType.createdAt,
        updatedAt: mockDocumentType.updatedAt,
      });

      expect(mockFindOne.lean).toHaveBeenCalled();
      expect(spyFindOne).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if document type not found", async () => {
      const mockFindOne = {
        lean: jest.fn().mockResolvedValue(null),
      };

      const spyFindOne = jest
        .spyOn(mockDocumentTypeModel, "findOne")
        .mockReturnValue(
          mockFindOne as unknown as ReturnType<
            typeof mockDocumentTypeModel.findOne
          >,
        );

      await expect(
        service.findOneByName(mockDocumentType.name),
      ).rejects.toThrow(
        `DocumentType with name ${mockDocumentType.name} not found`,
      );

      expect(mockFindOne.lean).toHaveBeenCalled();
      expect(spyFindOne).toHaveBeenCalledTimes(1);
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
        id: mockDocumentType._id,
        name: createDocumentTypeDto.name,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });
    });
  });

  describe("update", () => {
    it("should update an existing document type", async () => {
      const mockFindByIdAndUpdate = {
        lean: jest.fn().mockResolvedValue({
          ...mockDocumentType,
          name: DocumentTypeAllowedValues.RG,
          updatedAt: new Date(),
        }),
      };

      const spyFindByIdAndUpdate = jest
        .spyOn(mockDocumentTypeModel, "findByIdAndUpdate")
        .mockReturnValue(
          mockFindByIdAndUpdate as unknown as ReturnType<
            typeof mockDocumentTypeModel.findByIdAndUpdate
          >,
        );

      const updateDocumentTypeDto: UpdateDocumentTypeRequestDto = {
        name: DocumentTypeAllowedValues.RG,
      };

      const result = await service.update(
        mockDocumentType._id,
        updateDocumentTypeDto,
      );

      expect(result).toBeDefined();
      expect(result).toEqual({
        id: mockDocumentType._id,
        name: updateDocumentTypeDto.name,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });
      expect(mockFindByIdAndUpdate.lean).toHaveBeenCalled();
      expect(spyFindByIdAndUpdate).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if document type not found for update", async () => {
      const mockFindByIdAndUpdate = {
        lean: jest.fn().mockResolvedValue(null),
      };

      const spyFindByIdAndUpdate = jest
        .spyOn(mockDocumentTypeModel, "findByIdAndUpdate")
        .mockReturnValue(
          mockFindByIdAndUpdate as unknown as ReturnType<
            typeof mockDocumentTypeModel.findByIdAndUpdate
          >,
        );

      const updateDocumentTypeDto: UpdateDocumentTypeRequestDto = {
        name: DocumentTypeAllowedValues.RG,
      };

      await expect(
        service.update(mockDocumentType._id, updateDocumentTypeDto),
      ).rejects.toThrow(
        `DocumentType with id ${mockDocumentType._id} not found`,
      );

      expect(mockFindByIdAndUpdate.lean).toHaveBeenCalled();
      expect(spyFindByIdAndUpdate).toHaveBeenCalledTimes(1);
    });
  });
});
