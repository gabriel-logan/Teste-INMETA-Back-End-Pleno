import { Logger, NotFoundException } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { Connection } from "mongoose";
import { Model, Types } from "mongoose";
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

  const mockGenericObjectId = new Types.ObjectId("60c72b2f9b1e8b001c8e4d3a");

  const mockEmployeesService = {
    findById: jest.fn((id: Types.ObjectId) =>
      Promise.resolve({
        id,
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

  const mockDefaultDocument = {
    _id: new Types.ObjectId("60c72b2f9b1d8c001a8e4e1a"),
    id: "60c72b2f9b1d8c001a8e4e1a",
    employee: {
      _id: new Types.ObjectId("60c72b2f9b1d8c001c8e4e1a"),
      id: "60c72b2f9b1d8c001c8e4e1a",
      firstName: "John",
      lastName: "Doe",
      fullName: "John Doe",
      username: "johndoe",
      contractStatus: ContractStatus.ACTIVE,
      role: EmployeeRole.COMMON,
      cpf: "123.456.789-00",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    documentType: {
      _id: new Types.ObjectId("60c72b2f9b1d8c021c8e4e1a"),
      id: "60c72b2f9b1d8c021c8e4e1a",
      name: "Passport",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    status: DocumentStatus.AVAILABLE,
    documentUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSave = jest.fn(function (this: any) {
    return Promise.resolve({ ...this });
  });

  const mockDocumentModel = jest.fn().mockImplementation(
    (data) =>
      ({
        ...mockDefaultDocument,
        ...data,
        save: mockSave,
      }) as Model<Document>,
  ) as unknown as typeof Model & {
    find: jest.Mock;
    findById: jest.Mock;
    findByIdAndUpdate: jest.Mock;
    count: jest.Mock;
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

    mockDocumentModel.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([mockDefaultDocument]),
    });

    mockDocumentModel.findById = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(mockDefaultDocument),
    });

    mockDocumentModel.count = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(1),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        EmployeesService,
        {
          provide: getModelToken(Document.name),
          useValue: Model,
        },
      ],
    })
      .overrideProvider(getModelToken(Document.name))
      .useValue(mockDocumentModel)
      .overrideProvider(EmployeesService)
      .useValue(mockEmployeesService)
      .compile();

    service = module.get<DocumentsService>(DocumentsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return an array of PublicDocumentResponseDto", async () => {
      const result = await service.findAll();

      expect(result).toEqual([
        {
          _id: mockDefaultDocument._id,
          id: mockDefaultDocument._id.toString(),
          employee: mockDefaultDocument.employee,
          documentType: mockDefaultDocument.documentType,
          status: mockDefaultDocument.status,
          documentUrl: mockDefaultDocument.documentUrl,
          createdAt: expect.any(Date) as Date,
          updatedAt: expect.any(Date) as Date,
        },
      ]);
      expect(mockDocumentModel.find).toHaveBeenCalledTimes(1);
    });

    it("should return an array with filters applied", async () => {
      mockDocumentModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      });

      const result = await service.findAll({
        byDocumentTypeId: mockGenericObjectId,
        byEmployeeId: mockGenericObjectId,
        byStatus: DocumentStatus.AVAILABLE,
      });

      expect(result).toEqual([]);
      expect(mockDocumentModel.find).toHaveBeenCalledTimes(1);
    });
  });

  describe("findAllWithDocumentTypeAndEmployee", () => {
    it("should return an array of PublicDocumentResponseDto", async () => {
      const result = await service.findAllWithDocumentTypeAndEmployee();

      expect(result).toEqual([mockDefaultDocument]);
      expect(mockDocumentModel.find).toHaveBeenCalledTimes(1);
    });
  });

  describe("findById", () => {
    it("should return a PublicDocumentResponseDto", async () => {
      const result = await service.findById(mockGenericObjectId);

      expect(result).toEqual({
        _id: mockDefaultDocument._id,
        id: mockDefaultDocument._id.toString(),
        employee: mockDefaultDocument.employee,
        documentType: mockDefaultDocument.documentType,
        status: mockDefaultDocument.status,
        documentUrl: mockDefaultDocument.documentUrl,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });
      expect(mockDocumentModel.findById).toHaveBeenCalledTimes(1);
    });

    it("should throw NotFoundException if document does not exist", async () => {
      mockDocumentModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.findById("nonexistent-id" as unknown as Types.ObjectId),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.findById("nonexistent-id" as unknown as Types.ObjectId),
      ).rejects.toThrow("Document with id nonexistent-id not found");
    });

    it("should aply populates if provided", async () => {
      mockDocumentModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockDefaultDocument),
      });

      const result = await service.findById(mockGenericObjectId, {
        populates: ["employee", "documentType"],
      });

      expect(result).toEqual({
        _id: mockDefaultDocument._id,
        id: mockDefaultDocument._id.toString(),
        employee: mockDefaultDocument.employee,
        documentType: mockDefaultDocument.documentType,
        status: mockDefaultDocument.status,
        documentUrl: mockDefaultDocument.documentUrl,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });
      expect(mockDocumentModel.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe("findByIdWithDocumentTypeAndEmployee", () => {
    it("should return a DocumentFullResponseDto with documentType and employee populated", async () => {
      const result =
        await service.findByIdWithDocumentTypeAndEmployee(mockGenericObjectId);

      expect(result).toEqual({
        _id: mockDefaultDocument._id,
        id: mockDefaultDocument._id.toString(),
        employee: mockDefaultDocument.employee,
        documentType: mockDefaultDocument.documentType,
        status: mockDefaultDocument.status,
        documentUrl: mockDefaultDocument.documentUrl,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });
      expect(mockDocumentModel.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe("update", () => {
    it("should update a document and return the updated PublicDocumentResponseDto", async () => {
      const updateDocumentDto = {
        status: DocumentStatus.MISSING,
      };

      const mockUpdatedDocument = {
        ...mockDefaultDocument,
        status: updateDocumentDto.status,
      };

      mockDocumentModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockUpdatedDocument),
      });

      const result = await service.update(
        mockGenericObjectId,
        updateDocumentDto,
      );

      expect(result).toEqual({
        _id: mockUpdatedDocument._id,
        id: mockUpdatedDocument._id.toString(),
        employee: mockUpdatedDocument.employee,
        documentType: mockUpdatedDocument.documentType,
        status: mockUpdatedDocument.status,
        documentUrl: mockUpdatedDocument.documentUrl,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });
    });

    it("should throw NotFoundException if document to update does not exist", async () => {
      const updateDocumentDto = {
        status: DocumentStatus.MISSING,
      };

      mockDocumentModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.update(
          "nonexistent-id" as unknown as Types.ObjectId,
          updateDocumentDto,
        ),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.update(
          "nonexistent-id" as unknown as Types.ObjectId,
          updateDocumentDto,
        ),
      ).rejects.toThrow("Document with id nonexistent-id not found");
    });
  });

  describe("getDocumentStatusesByEmployeeId", () => {
    it("should return an array of document statuses for a given employee ID", async () => {
      const employeeId = new Types.ObjectId("60c72b2f9b1d8c001c8e4e1a");

      const mockDocuments = [
        {
          _id: new Types.ObjectId("60c72b2f9b1d8c001a8e4e1a"),
          employee: {
            _id: employeeId,
          },
          documentType: {
            _id: new Types.ObjectId("60c72b2f9b1d8c001a1e4e1a"),
            name: "RG",
          },
          status: DocumentStatus.AVAILABLE,
        },
        {
          _id: new Types.ObjectId("60c72b2f9b1d8c001a8e4e1b"),
          employee: {
            _id: employeeId,
          },
          documentType: {
            _id: new Types.ObjectId("60c71b2f9b1d8c001a1e4e1b"),
            name: "PDF",
          },
          status: DocumentStatus.MISSING,
        },
      ];

      mockDocumentModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockDocuments),
      });

      const result = await service.getDocumentStatusesByEmployeeId(employeeId);

      expect(result).toEqual({
        documentStatuses: [
          {
            documentName: "RG",
            documentStatus: {
              documentId: mockDocuments[0]._id.toString(),
              status: DocumentStatus.AVAILABLE,
            },
          },
          {
            documentName: "PDF",
            documentStatus: {
              documentId: mockDocuments[1]._id.toString(),
              status: DocumentStatus.MISSING,
            },
          },
        ],
      });
    });

    it("should throw NotFoundException if no documents found for employee", async () => {
      const employeeId = new Types.ObjectId("60c72b2f9b1d8c001c8e4e1a");

      mockDocumentModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      });

      await expect(
        service.getDocumentStatusesByEmployeeId(employeeId),
      ).rejects.toThrow(
        `No documents found for employee with id ${employeeId.toString()}`,
      );
    });

    it("should filter the results if status is provided", async () => {
      const employeeId = new Types.ObjectId("60c72b2f9b1d8c001c8e4e1a");

      const mockDocuments = [
        {
          _id: new Types.ObjectId("60c72b2f9b1d8c001a8e4e1a"),
          employee: {
            _id: employeeId,
          },
          documentType: {
            _id: new Types.ObjectId("60c72b2f9b1d8c001a1e4e1a"),
            name: "RG",
          },
          status: DocumentStatus.AVAILABLE,
        },
        {
          _id: new Types.ObjectId("60c72b2f9b1d8c001a8e4e1b"),
          employee: {
            _id: employeeId,
          },
          documentType: {
            _id: new Types.ObjectId("60c71b2f9b1d8c001a1e4e1b"),
            name: "PDF",
          },
          status: DocumentStatus.MISSING,
        },
      ];

      mockDocumentModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockDocuments),
      });

      const result = await service.getDocumentStatusesByEmployeeId(
        employeeId,
        DocumentStatus.MISSING,
      );

      expect(result).toEqual({
        documentStatuses: [
          {
            documentName: "PDF",
            documentStatus: {
              documentId: mockDocuments[1]._id.toString(),
              status: DocumentStatus.MISSING,
            },
          },
        ],
      });
    });

    it("should throw NotFoundException if no documents match the requested status", async () => {
      const employeeId = new Types.ObjectId("60c72b2f9b1d8c001c8e4e1a");

      const mockDocuments = [
        {
          _id: new Types.ObjectId("60c72b2f9b1d8c001a8e4e1a"),
          employee: {
            _id: employeeId,
          },
          documentType: {
            _id: new Types.ObjectId("60c72b2f9b1d8c001a1e4e1a"),
            name: "RG",
          },
          status: DocumentStatus.AVAILABLE,
        },
      ];

      mockDocumentModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockDocuments),
      });

      await expect(
        service.getDocumentStatusesByEmployeeId(
          employeeId,
          DocumentStatus.MISSING,
        ),
      ).rejects.toThrow(
        `No documents found for employee with id ${employeeId.toString()} with status missing`,
      );
    });
  });

  describe("getAllMissingDocuments", () => {
    it("should return an array of PublicDocumentResponseDto with missing documents", async () => {
      const mockMissingDocuments = [
        {
          ...mockDefaultDocument,
          status: DocumentStatus.MISSING,
        },
      ];

      mockDocumentModel.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockMissingDocuments),
      });

      mockDocumentModel.countDocuments = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockMissingDocuments.length),
      });

      const result = await service.getAllMissingDocuments();

      expect(result).toEqual({
        documents: mockMissingDocuments.map((doc) => ({
          _id: doc._id,
          id: doc._id.toString(),
          employee: doc.employee,
          documentType: doc.documentType,
          status: doc.status,
          documentUrl: doc.documentUrl,
          createdAt: expect.any(Date) as Date,
          updatedAt: expect.any(Date) as Date,
        })),
        total: mockMissingDocuments.length,
        page: 1,
        limit: 10,
      });
    });

    it("should apply filters for employeeId and documentTypeId", async () => {
      const employeeId = new Types.ObjectId("60c72b2f9b1d8c001c8e4e1a");
      const documentTypeId = new Types.ObjectId("60c72b2f9b1d8c001a1e4e1a");

      const mockDocuments = [
        {
          ...mockDefaultDocument,
        },
      ];

      mockDocumentModel.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockDocuments),
      });

      mockDocumentModel.countDocuments = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockDocuments.length),
      });

      const result = await service.getAllMissingDocuments(
        undefined,
        undefined,
        employeeId,
        documentTypeId,
      );

      expect(result).toEqual({
        documents: mockDocuments.map((doc) => ({
          _id: doc._id,
          id: doc._id.toString(),
          employee: doc.employee,
          documentType: doc.documentType,
          status: doc.status,
          documentUrl: doc.documentUrl,
          createdAt: expect.any(Date) as Date,
          updatedAt: expect.any(Date) as Date,
        })),
        total: mockDocuments.length,
        page: 1,
        limit: 10,
      });
    });
  });
});
