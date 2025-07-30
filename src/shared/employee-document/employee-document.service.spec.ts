import { getModelToken } from "@nestjs/mongoose";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { Model, Types } from "mongoose";
import {
  Document,
  DocumentStatus,
} from "src/documents/schemas/document.schema";

import { EmployeeDocumentService } from "./employee-document.service";

describe("EmployeeDocumentService", () => {
  let service: EmployeeDocumentService;

  const mockSave = jest.fn(function (this: Partial<Document>) {
    return Promise.resolve({
      _id: new Types.ObjectId("123e4567e89b12d3a4567890"),
      documentType: this.documentType,
      employee: this.employee,
      status: this.status ?? DocumentStatus.MISSING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  const mockDocumentModel = jest.fn().mockImplementation(
    (data) =>
      ({
        ...data,
        save: mockSave,
      }) as Model<DocumentType>,
  ) as unknown as typeof Model & {
    findOneAndDelete: jest.Mock;
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    mockDocumentModel.findOneAndDelete = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeDocumentService,
        {
          provide: getModelToken(Document.name),
          useValue: Model,
        },
      ],
    })
      .overrideProvider(getModelToken(Document.name))
      .useValue(mockDocumentModel)
      .compile();

    service = module.get<EmployeeDocumentService>(EmployeeDocumentService);
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

      mockDocumentModel.findOneAndDelete = jest
        .fn()
        .mockReturnValue(mockFindOneAndDelete);

      const result = await service.deleteDocumentByEmployeeIdAndDocumentTypeId(
        new Types.ObjectId("123e4567e89b12d3a4567890"),
        new Types.ObjectId("123e4567e89b12d3a4567890"),
      );

      expect(result).toBeDefined();
      expect(mockFindOneAndDelete.lean).toHaveBeenCalled();
      expect(mockDocumentModel.findOneAndDelete).toHaveBeenCalledTimes(1);
    });

    it("should throw NotFoundException if document not found", async () => {
      const mockFindOneAndDelete = {
        lean: jest.fn().mockResolvedValue(null),
      };

      mockDocumentModel.findOneAndDelete = jest
        .fn()
        .mockReturnValue(mockFindOneAndDelete);

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
