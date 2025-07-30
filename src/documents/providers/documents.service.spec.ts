import { Logger, NotFoundException } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { Connection, Model } from "mongoose";
import { Types } from "mongoose";
import { MongooseProvider } from "src/configs/mongoose-provider";
import { EmployeesService } from "src/employees/providers/employees.service";
import {
  ContractStatus,
  EmployeeRole,
} from "src/employees/schemas/employee.schema";

import { Document, DocumentStatus } from "../schemas/document.schema";
import { DocumentsService } from "./documents.service";

const mockGenericObjectId = new Types.ObjectId("60c72b2f9b1e8b001c8e4d3a");

describe("DocumentsService", () => {
  let service: DocumentsService;
  let mockDocumentModel: Model<Document>;

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

  const mockPublicDocumentResponseDto = {
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

  const mockDocumentModelSchema = class {
    private readonly data: any;

    constructor(data: Partial<Document> = {}) {
      this.data = {
        _id: "1",
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.save = jest.fn().mockResolvedValue(this.data);
    }

    public static readonly find = jest.fn();
    public static readonly findById = jest.fn();
    public static readonly findByIdAndUpdate = jest.fn();
    public static readonly countDocuments = jest.fn();

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
          _id: mockPublicDocumentResponseDto._id,
          id: mockPublicDocumentResponseDto._id.toString(),
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

      const result = await service.findById(mockGenericObjectId);

      expect(result).toEqual({
        _id: mockPublicDocumentResponseDto._id,
        id: mockPublicDocumentResponseDto._id.toString(),
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

      await expect(
        service.findById("nonexistent-id" as unknown as Types.ObjectId),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.findById("nonexistent-id" as unknown as Types.ObjectId),
      ).rejects.toThrow("Document with id nonexistent-id not found");
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

      const result = await service.update(
        mockGenericObjectId,
        updateDocumentDto,
      );

      expect(result).toEqual({
        _id: mockUpdatedDocument._id,
        id: mockUpdatedDocument._id.toString(),
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

      jest.spyOn(mockDocumentModel, "find").mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockDocuments),
      } as unknown as ReturnType<typeof mockDocumentModel.find>);

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

      jest.spyOn(mockDocumentModel, "find").mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      } as unknown as ReturnType<typeof mockDocumentModel.find>);

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

      jest.spyOn(mockDocumentModel, "find").mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockDocuments),
      } as unknown as ReturnType<typeof mockDocumentModel.find>);

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

      jest.spyOn(mockDocumentModel, "find").mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockDocuments),
      } as unknown as ReturnType<typeof mockDocumentModel.find>);

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
          _id: new Types.ObjectId("60c72b2f9b1d8c001a8e4e1a"),
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
            _id: new Types.ObjectId("60c72b2f9b1d8c001a1e4e1a"),
            id: "60c72b2f9b1d8c001a1e4e1a",
            name: "RG",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          status: DocumentStatus.MISSING,
          documentUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(mockDocumentModel, "find").mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockMissingDocuments),
      } as unknown as ReturnType<typeof mockDocumentModel.find>);

      jest.spyOn(mockDocumentModel, "countDocuments").mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockMissingDocuments.length),
      } as unknown as ReturnType<typeof mockDocumentModel.countDocuments>);

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
          _id: new Types.ObjectId("60c72b2f9b1d8c001a8e4e1a"),
          employee: {
            _id: employeeId,
            id: employeeId.toString(),
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
            _id: documentTypeId,
            id: documentTypeId.toString(),
            name: "RG",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          status: DocumentStatus.MISSING,
        },
      ];

      jest.spyOn(mockDocumentModel, "find").mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockDocuments),
      } as unknown as ReturnType<typeof mockDocumentModel.find>);

      jest.spyOn(mockDocumentModel, "countDocuments").mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockDocuments.length),
      } as unknown as ReturnType<typeof mockDocumentModel.countDocuments>);

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
        })),
        total: mockDocuments.length,
        page: 1,
        limit: 10,
      });
    });
  });
});
