import { getModelToken } from "@nestjs/mongoose";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { type Model, Types } from "mongoose";
import {
  Document,
  DocumentStatus,
} from "src/documents/schemas/document.schema";

import { EmployeeDocumentService } from "./employee-document.service";

describe("EmployeeDocumentService", () => {
  let service: EmployeeDocumentService;
  let mockDocumentModel: Model<Document>;

  const mockDocumentModelSchema = class {
    private readonly data: any;

    constructor(data: Partial<Document> = {}) {
      this.data = {
        _id: new Types.ObjectId("123e4567e89b12d3a4567890"),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.save = jest.fn().mockResolvedValue(this.data);
    }

    public static readonly findOneAndDelete = jest.fn();
    public save = jest.fn();
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeDocumentService,
        {
          provide: getModelToken(Document.name),
          useValue: mockDocumentModelSchema,
        },
      ],
    }).compile();

    service = module.get<EmployeeDocumentService>(EmployeeDocumentService);
    mockDocumentModel = module.get<Model<Document>>(
      getModelToken(Document.name),
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createDocument", () => {
    it("should create a document", async () => {
      const result = await service.createDocument(
        new Types.ObjectId("123e4567e89b12d3a4567890"),
        new Types.ObjectId("123e4567e89b12d3a4567890"),
      );

      expect(result).toBeDefined();
      expect(result).toEqual({
        _id: new Types.ObjectId("123e4567e89b12d3a4567890"),
        documentType: new Types.ObjectId("123e4567e89b12d3a4567890"),
        status: DocumentStatus.MISSING,
        employee: new Types.ObjectId("123e4567e89b12d3a4567890"),
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });
    });
  });

  describe("deleteDocumentByEmployeeIdAndDocumentTypeId", () => {
    it("should delete a document", async () => {
      const mockFindOneAndDelete = {
        lean: jest.fn().mockResolvedValue({
          _id: "1",
          documentType: "documentTypeId",
          status: DocumentStatus.MISSING,
          employee: "employeeId",
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      };

      const spyFindOneAndDelete = jest
        .spyOn(mockDocumentModel, "findOneAndDelete")
        .mockReturnValue(
          mockFindOneAndDelete as unknown as ReturnType<
            typeof mockDocumentModel.findOneAndDelete
          >,
        );

      const result = await service.deleteDocumentByEmployeeIdAndDocumentTypeId(
        new Types.ObjectId("123e4567e89b12d3a4567890"),
        new Types.ObjectId("123e4567e89b12d3a4567890"),
      );

      expect(result).toBeDefined();
      expect(mockFindOneAndDelete.lean).toHaveBeenCalled();
      expect(spyFindOneAndDelete).toHaveBeenCalledTimes(1);
    });

    it("should throw NotFoundException if document not found", async () => {
      const mockFindOneAndDelete = {
        lean: jest.fn().mockResolvedValue(null),
      };

      jest
        .spyOn(mockDocumentModel, "findOneAndDelete")
        .mockReturnValue(
          mockFindOneAndDelete as unknown as ReturnType<
            typeof mockDocumentModel.findOneAndDelete
          >,
        );

      await expect(
        service.deleteDocumentByEmployeeIdAndDocumentTypeId(
          new Types.ObjectId("123e4567e89b12d3a4567890"),
          new Types.ObjectId("123e4567e89b12d3a4567890"),
        ),
      ).rejects.toThrow(
        `Document with employeeId 123e4567e89b12d3a4567890 and documentTypeId 123e4567e89b12d3a4567890 not found`,
      );
    });
  });
});
