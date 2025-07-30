import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { Types } from "mongoose";
import type { AuthPayload } from "src/common/types";
import { EmployeeRole } from "src/employees/schemas/employee.schema";

import { DocumentFilesService } from "../providers/document-files.service";
import { DocumentFilesController } from "./document-files.controller";

describe("DocumentFilesController", () => {
  let controller: DocumentFilesController;

  const mockDocumentFilesService = {
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
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentFilesController],
      providers: [DocumentFilesService],
    })
      .overrideProvider(DocumentFilesService)
      .useValue(mockDocumentFilesService)
      .compile();

    controller = module.get<DocumentFilesController>(DocumentFilesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("sendDocumentFile", () => {
    it("should send a document file and return a success message", async () => {
      const id = new Types.ObjectId("60c72b2f9b1e8c001c8f8e1d");

      const fakeMulterFile = {
        originalname: "document.pdf",
        mimetype: "application/pdf",
        buffer: Buffer.alloc(1 * 1024 * 1024), // 1 MB buffer
        size: 1 * 1024 * 1024, // 1 MB
      } as Express.Multer.File;

      const fakeEmployeeAuthPayload = {
        sub: id.toString(),
        role: EmployeeRole.ADMIN,
        username: "employeeUsername",
      } as AuthPayload;

      const result = await controller.sendDocumentFile(
        id,
        fakeMulterFile,
        fakeEmployeeAuthPayload,
      );

      expect(result.message).toEqual("Document file sent successfully");
      expect(mockDocumentFilesService.sendDocumentFile).toHaveBeenCalledWith(
        id,
        fakeMulterFile,
        fakeEmployeeAuthPayload,
      );
    });
  });

  describe("deleteDocumentFile", () => {
    it("should delete a document file and return a success message", async () => {
      const id = new Types.ObjectId("60c72b2f9b1e8c001c8f8e1d");

      const result = await controller.deleteDocumentFile(id);

      expect(result.message).toEqual("Document file deleted successfully");
      expect(mockDocumentFilesService.deleteDocumentFile).toHaveBeenCalledWith(
        id,
      );
    });
  });
});
