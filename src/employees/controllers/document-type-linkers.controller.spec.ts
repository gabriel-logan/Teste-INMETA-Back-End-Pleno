import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { DocumentTypeLinkersController } from "./document-type-linkers.controller";

describe("DocumentTypeLinkersController", () => {
  let controller: DocumentTypeLinkersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentTypeLinkersController],
    }).compile();

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
      expect(mockEmployeesService.linkDocumentTypes).toHaveBeenCalledWith(
        id,
        linkDocumentTypesDto,
      );
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
      expect(mockEmployeesService.unlinkDocumentTypes).toHaveBeenCalledWith(
        id,
        linkDocumentTypesDto,
      );
    });
  });
});
