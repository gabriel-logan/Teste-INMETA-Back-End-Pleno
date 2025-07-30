import { Logger } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { Connection } from "mongoose";
import { Types } from "mongoose";
import type { AuthPayload } from "src/common/types";
import envTests from "src/configs/env.tests";
import { MongooseProvider } from "src/configs/mongoose-provider";
import {
  ContractStatus,
  EmployeeRole,
} from "src/employees/schemas/employee.schema";

import { DocumentStatus } from "../schemas/document.schema";
import { DocumentFilesService } from "./document-files.service";
import { DocumentsService } from "./documents.service";

describe("DocumentFilesService", () => {
  let service: DocumentFilesService;

  const mockGenericObjectId = new Types.ObjectId("60c72b2f9b1d8c001a8e4e1a");

  const mockDocumentService = {
    findById: jest.fn(),
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

  beforeAll(() => {
    jest.spyOn(Logger.prototype, "error").mockImplementation(() => {});

    // Mock the Mongoose connection
    MongooseProvider.setMongooseInstance(
      mockConnection as unknown as Connection,
    );
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(envTests)],
      providers: [DocumentFilesService, DocumentsService],
    })
      .overrideProvider(DocumentsService)
      .useValue(mockDocumentService)
      .compile();

    service = module.get<DocumentFilesService>(DocumentFilesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("sendDocumentFile", () => {
    it("should return success message when document file is sent", async () => {
      const employeeId = new Types.ObjectId("60c72b2f9b1d8c001c8e4e1a");

      const mockDocument = {
        _id: new Types.ObjectId("60c72b2f9b1d8c001a8e4e1a"),
        status: DocumentStatus.MISSING,
        employee: {
          _id: employeeId,
          username: "johndoe",
        },
        documentUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        save: jest.fn().mockResolvedValue(true),
      };

      const spyOnFindById = jest
        .spyOn(mockDocumentService, "findById")
        .mockReturnValue(
          mockDocument as unknown as ReturnType<
            typeof mockDocumentService.findById
          >,
        );

      const mockFile = {
        originalname: "document.pdf",
        buffer: Buffer.from("mock file content"),
        mimetype: "application/pdf",
      } as Express.Multer.File;

      const mockAuthPayload: AuthPayload = {
        sub: employeeId.toString(),
        role: EmployeeRole.COMMON,
        username: "johndoe",
        contractStatus: ContractStatus.ACTIVE,
      };

      const result = await service.sendDocumentFile(
        mockGenericObjectId,
        mockFile,
        mockAuthPayload,
      );

      expect(result).toEqual({
        message: "Document file sent successfully",
        documentUrl: expect.any(String) as string,
      });
      expect(spyOnFindById).toHaveBeenCalledTimes(1);
      expect(mockDocument.save).toHaveBeenCalled();
      expect(mockDocument.status).toBe(DocumentStatus.AVAILABLE);
      expect(mockDocument.documentUrl).toBeDefined();
    });

    it("should throw BadRequestException if document has already been sent", async () => {
      const mockDocument = {
        _id: new Types.ObjectId("60c72b2f9b1d8c001a8e4e1a"),
        employee: new Types.ObjectId("60c72b2f9b1d8c001c8e4e1a"),
        status: DocumentStatus.AVAILABLE,
        documentUrl: "http://example.com/document.pdf",
      };

      jest
        .spyOn(mockDocumentService, "findById")
        .mockReturnValue(
          mockDocument as unknown as ReturnType<
            typeof mockDocumentService.findById
          >,
        );

      const mockFile = {} as unknown as Express.Multer.File;

      const mockAuthPayload = {} as unknown as AuthPayload;

      await expect(
        service.sendDocumentFile(
          mockGenericObjectId,
          mockFile,
          mockAuthPayload,
        ),
      ).rejects.toThrow(
        `Document with id ${mockGenericObjectId.toString()} has already been sent. If you want to resend it, please delete the existing document and create a new one.`,
      );
    });

    it("should throw ForbiddenException if common employee is not the owner of the document", async () => {
      const mockDocument = {
        _id: new Types.ObjectId("60c72b2f9b1d8c001a8e4e1a"),
        employee: new Types.ObjectId("60c72b2f9b1d8c001c8e4e1a"),
        status: DocumentStatus.MISSING,
        documentUrl: null,
      };

      jest
        .spyOn(mockDocumentService, "findById")
        .mockReturnValue(
          mockDocument as unknown as ReturnType<
            typeof mockDocumentService.findById
          >,
        );

      const mockFile = {} as unknown as Express.Multer.File;

      const mockAuthPayload: AuthPayload = {
        sub: new Types.ObjectId("60c72b2f9b1d8c001a8e4e1b").toString(),
        role: EmployeeRole.COMMON,
        username: "johndoe",
        contractStatus: ContractStatus.ACTIVE,
      };

      await expect(
        service.sendDocumentFile(
          mockGenericObjectId,
          mockFile,
          mockAuthPayload,
        ),
      ).rejects.toThrow(
        `Employee johndoe is not the owner of document ${mockGenericObjectId.toString()}`,
      );
    });

    it("should generate url with final .bin when mimeType is undefined", async () => {
      const mockDocument = {
        _id: new Types.ObjectId("60c72b2f9b1d8c001a8e4e1a"),
        employee: new Types.ObjectId("60c72b2f9b1d8c001c8e4e1a"),
        status: DocumentStatus.MISSING,
        documentUrl: null,
        save: jest.fn().mockResolvedValue(true),
      };

      jest
        .spyOn(mockDocumentService, "findById")
        .mockReturnValue(
          mockDocument as unknown as ReturnType<
            typeof mockDocumentService.findById
          >,
        );

      const mockAuthPayload = {} as unknown as AuthPayload;

      const mockFile = {
        originalname: "document",
        mimetype: undefined,
      } as unknown as Express.Multer.File;

      const result = await service.sendDocumentFile(
        mockGenericObjectId,
        mockFile,
        mockAuthPayload,
      );

      expect(result).toEqual({
        message: "Document file sent successfully",
        documentUrl: expect.stringContaining(".bin") as string,
      });
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
        .spyOn(mockDocumentService, "findById")
        .mockReturnValue(
          mockDocument as unknown as ReturnType<
            typeof mockDocumentService.findById
          >,
        );

      const urlBeforeDelete = mockDocument.documentUrl;

      const result = await service.deleteDocumentFile(mockGenericObjectId);

      expect(result).toEqual({
        message: "Document file deleted successfully",
        documentUrl: urlBeforeDelete,
      });
      expect(spyOnFindById).toHaveBeenCalledTimes(1);
      expect(mockDocument.save).toHaveBeenCalled();
      expect(mockDocument.status).toBe(DocumentStatus.MISSING);
      expect(mockDocument.documentUrl).toBeDefined();
    });

    it("should throw BadRequestException if document does not have a file to delete", async () => {
      const mockDocument = {
        _id: new Types.ObjectId("60c72b2f9b1d8c001a8e4e1a"),
        employee: new Types.ObjectId("60c72b2f9b1d8c001c8e4e1a"),
        status: DocumentStatus.MISSING,
        documentUrl: null,
      };

      jest
        .spyOn(mockDocumentService, "findById")
        .mockReturnValue(
          mockDocument as unknown as ReturnType<
            typeof mockDocumentService.findById
          >,
        );

      await expect(
        service.deleteDocumentFile(mockGenericObjectId),
      ).rejects.toThrow(
        `Document with id ${mockGenericObjectId.toString()} does not have a file to delete.`,
      );
    });
  });
});
