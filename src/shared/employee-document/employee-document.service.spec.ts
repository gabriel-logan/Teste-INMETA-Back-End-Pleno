import { getModelToken } from "@nestjs/mongoose";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { Model } from "mongoose";
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

    constructor(data?: unknown[]) {
      this.data = {
        _id: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
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
        "employeeId",
        "documentTypeId",
      );

      expect(result).toBeDefined();
      expect(result).toEqual({
        _id: "1",
        documentType: "documentTypeId",
        status: DocumentStatus.MISSING,
        employee: "employeeId",
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
        "employeeId",
        "documentTypeId",
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
          "employeeId",
          "documentTypeId",
        ),
      ).rejects.toThrow(
        `Document with employeeId employeeId and documentTypeId documentTypeId not found`,
      );
    });
  });
});
