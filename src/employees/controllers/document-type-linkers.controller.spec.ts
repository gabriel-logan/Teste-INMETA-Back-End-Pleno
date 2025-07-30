import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { Types } from "mongoose";

import type { LinkDocumentTypesRequestDto } from "../dto/request/link-document-types.dto";
import { DocumentTypeLinkersService } from "../providers/document-type-linkers.service";
import { DocumentTypeLinkersController } from "./document-type-linkers.controller";

describe("DocumentTypeLinkersController", () => {
  let controller: DocumentTypeLinkersController;

  const mockDocumentTypeLinkersService = {
    linkDocumentTypes: jest.fn(
      (_employeeId: string, dto: LinkDocumentTypesRequestDto) =>
        Promise.resolve({
          documentTypeIdsLinked: dto.documentTypeIds,
        }),
    ),
    unlinkDocumentTypes: jest.fn(
      (_employeeId: string, dto: LinkDocumentTypesRequestDto) =>
        Promise.resolve({
          documentTypeIdsUnlinked: dto.documentTypeIds,
        }),
    ),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentTypeLinkersController],
      providers: [DocumentTypeLinkersService],
    })
      .overrideProvider(DocumentTypeLinkersService)
      .useValue(mockDocumentTypeLinkersService)
      .compile();

    controller = module.get<DocumentTypeLinkersController>(
      DocumentTypeLinkersController,
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("linkDocumentTypes", () => {
    it("should link document types to an employee", async () => {
      const docTypesIds = [
        new Types.ObjectId("60c72b2f9b1e8c001c8f8e1d"),
        new Types.ObjectId("60c72b2f9b1e8c001c8f8e1e"),
      ];

      const linkDocumentTypesDto: LinkDocumentTypesRequestDto = {
        documentTypeIds: docTypesIds,
      };

      const id = new Types.ObjectId("60c72b2f9b1e8c001c8f8e1d");

      const result = await controller.linkDocumentTypes(
        id,
        linkDocumentTypesDto,
      );

      expect(result).toEqual({
        documentTypeIdsLinked: linkDocumentTypesDto.documentTypeIds,
      });
      expect(
        mockDocumentTypeLinkersService.linkDocumentTypes,
      ).toHaveBeenCalledWith(id, linkDocumentTypesDto);
    });
  });

  describe("unlinkDocumentTypes", () => {
    it("should unlink document types from an employee", async () => {
      const docTypesIds = [
        new Types.ObjectId("60c72b2f9b1e8c001c8f8e1d"),
        new Types.ObjectId("60c72b2f9b1e8c001c8f8e1e"),
      ];

      const linkDocumentTypesDto: LinkDocumentTypesRequestDto = {
        documentTypeIds: docTypesIds,
      };

      const id = new Types.ObjectId("60c72b2f9b1e8c001c8f8e1d");

      const result = await controller.unlinkDocumentTypes(
        id,
        linkDocumentTypesDto,
      );

      expect(result).toEqual({
        documentTypeIdsUnlinked: linkDocumentTypesDto.documentTypeIds,
      });
      expect(
        mockDocumentTypeLinkersService.unlinkDocumentTypes,
      ).toHaveBeenCalledWith(id, linkDocumentTypesDto);
    });
  });
});
