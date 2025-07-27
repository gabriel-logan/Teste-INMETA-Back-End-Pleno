import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { Types } from "mongoose";
import type { AuthPayload } from "src/common/types";
import { EmployeeRole } from "src/employees/schemas/employee.schema";

import type { UpdateDocumentRequestDto } from "../dto/request/update-document.dto";
import { DocumentsService } from "../providers/documents.service";
import { DocumentStatus } from "../schemas/document.schema";
import { DocumentsController } from "./documents.controller";

describe("DocumentsController", () => {
  let controller: DocumentsController;

  const mockDocumentsService = {
    findAll: jest.fn(() => Promise.resolve([])),
    findById: jest.fn((id: string) =>
      Promise.resolve({
        id: id,
        employee: {},
        documentType: {},
        status: DocumentStatus.AVAILABLE,
        documentUrl: "https://example.com/document.pdf",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ),
    update: jest.fn((id: string, dto: UpdateDocumentRequestDto) =>
      Promise.resolve({
        id: id,
        employee: {},
        documentType: {},
        status: dto.status,
        documentUrl: "https://example.com/document.pdf",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ),
    sendDocumentFile: jest.fn(() =>
      Promise.resolve({
        message: "Document file sent successfully",
        documentUrl: "https://example.com/document.pdf",
      }),
    ),

    deleteDocumentFile: jest.fn(() =>
      Promise.resolve({
        message: "Document file deleted successfully",
        documentUrl: "https://example.com/document.pdf",
      }),
    ),

    getDocumentStatusesByEmployeeId: jest.fn(() =>
      Promise.resolve({
        employeeId: {
          status: DocumentStatus.AVAILABLE,
          documentId: "1234567890abcdef",
        },
      }),
    ),

    getAllMissingDocuments: jest.fn(() => {
      const documents = [
        {
          id: "1234567890abcdef",
          employee: {},
          documentType: {},
          status: DocumentStatus.MISSING,
          documentUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      return Promise.resolve({
        documents: documents.map((doc) => ({
          id: doc.id,
          employee: doc.employee,
          documentType: doc.documentType,
          status: doc.status,
          documentUrl: doc.documentUrl,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        })),
        total: documents.length,
        page: 1,
        limit: 10,
      });
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [DocumentsService],
    })
      .overrideProvider(DocumentsService)
      .useValue(mockDocumentsService)
      .compile();

    controller = module.get<DocumentsController>(DocumentsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("findAll", () => {
    it("should return an array of documents", async () => {
      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(mockDocumentsService.findAll).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("should return a document by id", async () => {
      const id = "1234567890abcdef";

      const result = await controller.findById(id);

      expect(result.id).toEqual(id);
      expect(mockDocumentsService.findById).toHaveBeenCalledWith(id);
    });
  });

  describe("update", () => {
    it("should update a document and return the updated document", async () => {
      const id = "1234567890abcdef";

      const dto: UpdateDocumentRequestDto = {
        status: DocumentStatus.AVAILABLE,
      };

      const result = await controller.update(id, dto);

      expect(result.id).toEqual(id);
      expect(result.status).toEqual(dto.status);
      expect(mockDocumentsService.update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe("sendDocumentFile", () => {
    it("should send a document file and return a success message", async () => {
      const id = "60c72b2f9b1e8c001c8f8e1d";

      const fakeMulterFile = {
        originalname: "document.pdf",
        mimetype: "application/pdf",
        buffer: Buffer.from("fake file content"),
      } as Express.Multer.File;

      const fakeEmployeeAuthPayload = {
        sub: new Types.ObjectId(id),
        role: EmployeeRole.ADMIN,
        username: "employeeUsername",
      } as AuthPayload;

      const result = await controller.sendDocumentFile(
        id,
        fakeMulterFile,
        fakeEmployeeAuthPayload,
      );

      expect(result.message).toEqual("Document file sent successfully");
      expect(mockDocumentsService.sendDocumentFile).toHaveBeenCalledWith(
        id,
        fakeMulterFile,
        fakeEmployeeAuthPayload,
      );
    });
  });

  describe("deleteDocumentFile", () => {
    it("should delete a document file and return a success message", async () => {
      const id = "60c72b2f9b1e8c001c8f8e1d";

      const result = await controller.deleteDocumentFile(id);

      expect(result.message).toEqual("Document file deleted successfully");
      expect(mockDocumentsService.deleteDocumentFile).toHaveBeenCalledWith(id);
    });
  });

  describe("findAllMissingDocuments", () => {
    it("should return an array of missing documents", async () => {
      const result = await controller.getAllMissingDocuments();

      expect(result).toEqual({
        documents: expect.any(Array) as unknown[],
        total: 1,
        page: 1,
        limit: 10,
      });
      expect(mockDocumentsService.getAllMissingDocuments).toHaveBeenCalled();
    });
  });

  describe("getDocumentStatusesByEmployeeId", () => {
    it("should return document statuses by employee ID", async () => {
      const employeeId = "1234567890abcdef";
      const status = DocumentStatus.AVAILABLE;

      const result = await controller.getDocumentStatusesByEmployeeId(
        employeeId,
        status,
      );

      expect(result).toEqual({
        employeeId: {
          status: DocumentStatus.AVAILABLE,
          documentId: "1234567890abcdef",
        },
      });
      expect(
        mockDocumentsService.getDocumentStatusesByEmployeeId,
      ).toHaveBeenCalledWith(employeeId, status);
    });
  });

  describe("getAllMissingDocuments", () => {
    it("should return all missing documents", async () => {
      const result = await controller.getAllMissingDocuments();

      expect(result).toEqual({
        documents: expect.any(Array) as unknown[],
        total: 1,
        page: 1,
        limit: 10,
      });
      expect(mockDocumentsService.getAllMissingDocuments).toHaveBeenCalled();
    });
  });
});
