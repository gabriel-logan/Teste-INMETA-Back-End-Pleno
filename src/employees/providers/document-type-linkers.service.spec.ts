import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { Connection } from "mongoose";
import { Types } from "mongoose";
import { MongooseProvider } from "src/configs/mongoose-provider";
import { DocumentTypesService } from "src/document-types/providers/document-types.service";
import { EmployeeDocumentService } from "src/shared/employee-document/employee-document.service";

import type { LinkDocumentTypesRequestDto } from "../dto/request/link-document-types.dto";
import { DocumentTypeLinkersService } from "./document-type-linkers.service";
import { EmployeesService } from "./employees.service";

describe("DocumentTypeLinkersService", () => {
  let service: DocumentTypeLinkersService;

  const mockDocumentTypesService = {
    findById: jest.fn(),
  };

  const mockEmployeeDocumentService = {
    createDocument: jest.fn(),
    deleteDocumentByEmployeeIdAndDocumentTypeId: jest.fn(),
  };

  const mockEmployeesService = {
    findById: jest.fn(),
  };

  const mockGenericObjectId = new Types.ObjectId("507f1f77bcf86cd799439011");

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
    // Mock the Mongoose connection
    MongooseProvider.setMongooseInstance(
      mockConnection as unknown as Connection,
    );
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentTypeLinkersService,
        EmployeesService,
        EmployeeDocumentService,
        DocumentTypesService,
      ],
    })
      .overrideProvider(EmployeesService)
      .useValue(mockEmployeesService)
      .overrideProvider(DocumentTypesService)
      .useValue(mockDocumentTypesService)
      .overrideProvider(EmployeeDocumentService)
      .useValue(mockEmployeeDocumentService)
      .compile();

    service = module.get<DocumentTypeLinkersService>(
      DocumentTypeLinkersService,
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("linkDocumentTypes", () => {
    it("should link document types to an employee", async () => {
      const linkDocumentTypesObjectIds = [
        new Types.ObjectId("123456789012345678901234"),
        new Types.ObjectId("123456789012345678901235"),
      ];

      mockEmployeesService.findById = jest.fn().mockReturnValue({
        documentTypes: [],
        save: jest.fn().mockResolvedValue({
          documentTypes: linkDocumentTypesObjectIds.map((id) => ({
            _id: id,
            name: `Document Type ${id.toString()}`,
          })),
        }),
      });

      const linkDocumentTypesDto: LinkDocumentTypesRequestDto = {
        documentTypeIds: linkDocumentTypesObjectIds,
      };

      linkDocumentTypesDto.documentTypeIds.forEach((docId) => {
        mockDocumentTypesService.findById = jest.fn().mockResolvedValue({
          id: docId,
          name: `Document Type ${docId.toString()}`,
        });

        mockEmployeeDocumentService.createDocument = jest
          .fn()
          .mockResolvedValue({
            _id: "doc1FromEmployeeDocumentService",
            name: `Document Type ${docId.toString()}`,
          });
      });

      const employeeId = mockGenericObjectId;

      const result = await service.linkDocumentTypes(
        employeeId,
        linkDocumentTypesDto,
      );

      expect(result).toEqual({
        documentTypeIdsLinked: linkDocumentTypesDto.documentTypeIds.map((id) =>
          id.toString(),
        ),
        documentIdsCreated: [
          "doc1FromEmployeeDocumentService",
          "doc1FromEmployeeDocumentService",
        ],
      });
      expect(mockEmployeesService.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe("unlinkDocumentTypes", () => {
    it("should unlink document types from an employee", async () => {
      const documentTypeIdsToUnlink: LinkDocumentTypesRequestDto = {
        documentTypeIds: [
          new Types.ObjectId("123456789012345678901234"),
          new Types.ObjectId("123456789012345678901235"),
        ],
      };

      mockEmployeesService.findById = jest.fn().mockReturnValue({
        documentTypes: [
          {
            _id: documentTypeIdsToUnlink.documentTypeIds[0],
            name: "Document Type 1",
          },
          {
            _id: documentTypeIdsToUnlink.documentTypeIds[1],
            name: "Document Type 2",
          },
        ],
        save: jest.fn().mockResolvedValue(true),
      });

      documentTypeIdsToUnlink.documentTypeIds.forEach((docId) => {
        mockDocumentTypesService.findById = jest.fn().mockResolvedValue({
          id: docId,
          name: `Document Type ${docId.toString()}`,
        });

        mockEmployeeDocumentService.deleteDocumentByEmployeeIdAndDocumentTypeId =
          jest.fn().mockResolvedValue({
            _id: docId,
            name: `Document Type ${docId.toString()}`,
          });
      });

      const employeeId = mockGenericObjectId;

      const result = await service.unlinkDocumentTypes(
        employeeId,
        documentTypeIdsToUnlink,
      );

      expect(result).toEqual({
        documentTypeIdsUnlinked: documentTypeIdsToUnlink.documentTypeIds.map(
          (id) => id.toString(),
        ),
        documentIdsDeleted: [
          documentTypeIdsToUnlink.documentTypeIds[1].toString(),
          documentTypeIdsToUnlink.documentTypeIds[1].toString(),
        ],
      });
      expect(mockEmployeesService.findById).toHaveBeenCalledTimes(1);
    });
  });

  it("should throw an error when no linked document types found for employee", async () => {
    const employeeId = mockGenericObjectId;

    mockEmployeesService.findById = jest.fn().mockReturnValue({
      documentTypes: [],
      save: jest.fn(),
    });

    await expect(
      service.unlinkDocumentTypes(employeeId, {
        documentTypeIds: [new Types.ObjectId("123456789012345678901234")],
      }),
    ).rejects.toThrow(
      "No linked document types found for employee 507f1f77bcf86cd799439011",
    );
  });
});
