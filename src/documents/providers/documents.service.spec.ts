import { NotFoundException } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { getModelToken } from "@nestjs/mongoose";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { Connection, Model } from "mongoose";
import { Types } from "mongoose";
import type { AuthPayload } from "src/common/types";
import envTests from "src/configs/env.tests";
import { MongooseProvider } from "src/configs/mongoose-provider";
import { EmployeesService } from "src/employees/providers/employees.service";
import {
  ContractStatus,
  EmployeeRole,
} from "src/employees/schemas/employee.schema";

import { Document, DocumentStatus } from "../schemas/document.schema";
import { DocumentsService } from "./documents.service";

describe("DocumentsService", () => {
  let service: DocumentsService;
  let mockDocumentModel: Model<Document>;

  const mockEmployeesService = {
    findById: jest.fn((id: string) =>
      Promise.resolve({
        id: id,
        firstName: "John",
        lastName: "Doe",
        fullName: "John Doe",
        contractStatus: ContractStatus.ACTIVE,
        documentTypes: [],
        cpf: "123.456.789-00",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ),
  };

  const mockPublicDocumentResponseDto = {
    _id: new Types.ObjectId("60c72b2f9b1d8c001a8e4e1a"),
    employee: {
      _id: new Types.ObjectId("60c72b2f9b1d8c001c8e4e1a"),
      firstName: "John",
      lastName: "Doe",
      fullName: "John Doe",
      contractStatus: ContractStatus.ACTIVE,
      documentTypes: [],
      cpf: "123.456.789-00",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    documentType: {
      _id: new Types.ObjectId("60c72b2f9b1d8c021c8e4e1a"),
      name: "Passport",
      description: "Passport document",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    status: DocumentStatus.AVAILABLE,
    documentUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

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

    public static readonly find = jest.fn();
    public static readonly findById = jest.fn();
    public static readonly findByIdAndUpdate = jest.fn();

    public save = jest.fn();
  };

  const mockSession = {
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    endSession: jest.fn(),
  };

  const mockConnection = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    transaction: jest.fn((fn) => fn(mockSession)),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    // Mock the Mongoose connection
    MongooseProvider.setMongooseInstance(
      mockConnection as unknown as Connection,
    );

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(envTests)],
      providers: [
        DocumentsService,
        EmployeesService,
        {
          provide: getModelToken(Document.name),
          useValue: mockDocumentModelSchema,
        },
      ],
    })
      .overrideProvider(EmployeesService)
      .useValue(mockEmployeesService)
      .compile();

    service = module.get<DocumentsService>(DocumentsService);
    mockDocumentModel = module.get<Model<Document>>(
      getModelToken(Document.name),
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return an array of PublicDocumentResponseDto", async () => {
      const spyOnFind = jest.spyOn(mockDocumentModel, "find").mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([mockPublicDocumentResponseDto]),
      } as unknown as ReturnType<typeof mockDocumentModel.find>);

      const result = await service.findAll();

      expect(result).toEqual([
        {
          id: mockPublicDocumentResponseDto._id,
          employee: mockPublicDocumentResponseDto.employee,
          documentType: mockPublicDocumentResponseDto.documentType,
          status: mockPublicDocumentResponseDto.status,
          documentUrl: mockPublicDocumentResponseDto.documentUrl,
          createdAt: expect.any(Date) as Date,
          updatedAt: expect.any(Date) as Date,
        },
      ]);
      expect(spyOnFind).toHaveBeenCalledTimes(1);
    });
  });

  describe("findById", () => {
    it("should return a PublicDocumentResponseDto", async () => {
      const spyOnFindById = jest
        .spyOn(mockDocumentModel, "findById")
        .mockReturnValue({
          populate: jest.fn().mockReturnThis(),
          lean: jest.fn().mockResolvedValue(mockPublicDocumentResponseDto),
        } as unknown as ReturnType<typeof mockDocumentModel.findById>);

      const result = await service.findById("1");

      expect(result).toEqual({
        id: mockPublicDocumentResponseDto._id,
        employee: mockPublicDocumentResponseDto.employee,
        documentType: mockPublicDocumentResponseDto.documentType,
        status: mockPublicDocumentResponseDto.status,
        documentUrl: mockPublicDocumentResponseDto.documentUrl,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });
      expect(spyOnFindById).toHaveBeenCalledTimes(1);
    });

    it("should throw NotFoundException if document does not exist", async () => {
      jest.spyOn(mockDocumentModel, "findById").mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(null),
      } as unknown as ReturnType<typeof mockDocumentModel.findById>);

      await expect(service.findById("nonexistent-id")).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findById("nonexistent-id")).rejects.toThrow(
        "Document with id nonexistent-id not found",
      );
    });
  });

  describe("update", () => {
    it("should update a document and return the updated PublicDocumentResponseDto", async () => {
      const updateDocumentDto = {
        status: DocumentStatus.MISSING,
      };

      const mockUpdatedDocument = {
        ...mockPublicDocumentResponseDto,
        status: updateDocumentDto.status,
      };

      jest.spyOn(mockDocumentModel, "findByIdAndUpdate").mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockUpdatedDocument),
      } as unknown as ReturnType<typeof mockDocumentModel.findByIdAndUpdate>);

      const result = await service.update("1", updateDocumentDto);

      expect(result).toEqual({
        id: mockUpdatedDocument._id,
        employee: mockUpdatedDocument.employee,
        documentType: mockUpdatedDocument.documentType,
        status: updateDocumentDto.status,
        documentUrl: mockUpdatedDocument.documentUrl,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });
    });

    it("should throw NotFoundException if document to update does not exist", async () => {
      const updateDocumentDto = {
        status: DocumentStatus.MISSING,
      };

      jest.spyOn(mockDocumentModel, "findByIdAndUpdate").mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      } as unknown as ReturnType<typeof mockDocumentModel.findByIdAndUpdate>);

      await expect(
        service.update("nonexistent-id", updateDocumentDto),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.update("nonexistent-id", updateDocumentDto),
      ).rejects.toThrow("Document with id nonexistent-id not found");
    });
  });

  describe("sendDocumentFile", () => {
    it("should return success message when document file is sent", async () => {
      const employeeId = new Types.ObjectId("60c72b2f9b1d8c001c8e4e1a");

      const mockDocument = {
        _id: new Types.ObjectId("60c72b2f9b1d8c001a8e4e1a"),
        employee: employeeId,
        status: DocumentStatus.MISSING,
        documentUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        save: jest.fn().mockResolvedValue(true),
      };

      const spyOnFindById = jest
        .spyOn(mockDocumentModel, "findById")
        .mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockDocument),
        } as unknown as ReturnType<typeof mockDocumentModel.findById>);

      const mockFile = {
        originalname: "document.pdf",
        buffer: Buffer.from("mock file content"),
        mimetype: "application/pdf",
      } as Express.Multer.File;

      const mockAuthPayload: AuthPayload = {
        sub: employeeId,
        role: EmployeeRole.COMMON,
        username: "johndoe",
      };

      const result = await service.sendDocumentFile(
        "1",
        mockFile,
        mockAuthPayload,
      );

      expect(result).toEqual({
        message: "Document file sent successfully",
        documentUrl: expect.any(String) as string,
      });
      expect(spyOnFindById).toHaveBeenCalledWith("1");
      expect(spyOnFindById).toHaveBeenCalledTimes(1);
      expect(mockDocument.save).toHaveBeenCalled();
      expect(mockDocument.status).toBe(DocumentStatus.AVAILABLE);
      expect(mockDocument.documentUrl).toBeDefined();
    });
  });

  describe("deleteDocumentFile", () => {
    it("should return success message when document file is deleted", async () => {
      const mockDocument = {
        _id: new Types.ObjectId("60c72b2f9b1d8c001a8e4e1a"),
        employee: new Types.ObjectId("60c72b2f9b1d8c001c8e4e1a"),
        status: DocumentStatus.AVAILABLE,
        documentUrl: "http://example.com/document.pdf",
        save: jest.fn().mockResolvedValue(true),
      };

      const spyOnFindById = jest
        .spyOn(mockDocumentModel, "findById")
        .mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockDocument),
        } as unknown as ReturnType<typeof mockDocumentModel.findById>);

      const urlBeforeDelete = mockDocument.documentUrl;

      const result = await service.deleteDocumentFile("1");

      expect(result).toEqual({
        message: "Document file deleted successfully",
        documentUrl: urlBeforeDelete,
      });
      expect(spyOnFindById).toHaveBeenCalledWith("1");
      expect(spyOnFindById).toHaveBeenCalledTimes(1);
      expect(mockDocument.save).toHaveBeenCalled();
      expect(mockDocument.status).toBe(DocumentStatus.MISSING);
      expect(mockDocument.documentUrl).toBeDefined();
    });
  });
});
