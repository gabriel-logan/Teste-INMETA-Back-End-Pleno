import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { Types } from "mongoose";
import { Transactional } from "src/common/decorators/transaction/Transactional";
import { DocumentTypesService } from "src/document-types/providers/document-types.service";
import { DocumentType } from "src/document-types/schemas/document-type.schema";
import { EmployeeDocumentService } from "src/shared/employee-document/employee-document.service";

import { LinkDocumentTypesRequestDto } from "../dto/request/link-document-types.dto";
import { DocumentTypeEmployeeLinkedResponseDto } from "../dto/response/documentType-employee-linked.dto";
import { DocumentTypeEmployeeUnlinkedResponseDto } from "../dto/response/documentType-employee-unlinked.dto";
import { EmployeesService } from "./employees.service";

@Injectable()
export class DocumentTypeLinkersService {
  private readonly logger = new Logger(DocumentTypeLinkersService.name);

  constructor(
    private readonly employeesService: EmployeesService,
    private readonly employeeDocumentService: EmployeeDocumentService,
    private readonly documentTypesService: DocumentTypesService,
  ) {}

  @Transactional()
  async linkDocumentTypes(
    employeeId: Types.ObjectId,
    linkDocumentTypesDto: LinkDocumentTypesRequestDto,
  ): Promise<DocumentTypeEmployeeLinkedResponseDto> {
    const { documentTypeIds } = linkDocumentTypesDto;

    const documentTypes = await Promise.all(
      documentTypeIds.map((id) => this.documentTypesService.findById(id)),
    );

    const employee = await this.employeesService.findById(employeeId, {
      lean: false,
    });

    // Prevent duplicate document types
    if (employee.documentTypes.length > 0) {
      const existingDocumentTypes = employee.documentTypes.map((doc) =>
        doc._id.toString(),
      );
      const newDocumentTypes = documentTypes.map((doc) => doc.id.toString());

      const duplicates = newDocumentTypes.filter((doc) =>
        existingDocumentTypes.includes(doc),
      );

      if (duplicates.length > 0) {
        const msg = `Document types ${duplicates.join(
          ", ",
        )} are already linked to employee ${employeeId.toString()}`;

        this.logger.warn(msg);

        throw new BadRequestException(msg);
      }
    }

    const existing = new Set(
      employee.documentTypes.map((doc) => doc._id.toString()),
    );

    for (const docId of documentTypes.map((doc) => doc)) {
      if (!existing.has(docId.id.toString())) {
        employee.documentTypes.push(docId.id as unknown as DocumentType);
      }
    }

    const documentsIds = [];

    // Create documents for each linked document type
    for (const documentType of documentTypes) {
      const newDocument = await this.employeeDocumentService.createDocument(
        employee._id,
        documentType._id,
      );
      documentsIds.push(newDocument._id);
    }

    const result = await employee.save();

    return {
      documentTypeIdsLinked: result.documentTypes.map((doc) =>
        doc._id.toString(),
      ),
      documentIdsCreated: documentsIds.map((doc) => doc.toString()),
    };
  }

  @Transactional()
  async unlinkDocumentTypes(
    employeeId: Types.ObjectId,
    unlinkDocumentTypesDto: LinkDocumentTypesRequestDto,
  ): Promise<DocumentTypeEmployeeUnlinkedResponseDto> {
    const { documentTypeIds } = unlinkDocumentTypesDto;

    const documentTypes = await Promise.all(
      documentTypeIds.map((id) => this.documentTypesService.findById(id)),
    );

    const employee = await this.employeesService.findById(employeeId, {
      lean: false,
    });

    // Check if the document types are linked to the employee
    const linkedDocumentTypes = employee.documentTypes.filter((doc) =>
      documentTypes.map((dt) => dt.id.toString()).includes(doc._id.toString()),
    );

    if (linkedDocumentTypes.length === 0) {
      throw new BadRequestException(
        `No linked document types found for employee ${employeeId.toString()}`,
      );
    }

    const idsToRemoveSet = new Set(
      documentTypes.map((doc) => doc.id.toString()),
    );

    employee.documentTypes = employee.documentTypes.filter(
      (docTypeId) => !idsToRemoveSet.has(docTypeId._id.toString()),
    );

    const deletedDocumentIds = [];

    // Remove documents associated with the unlinked document types
    for (const documentType of documentTypes) {
      const deletedDocumentId =
        await this.employeeDocumentService.deleteDocumentByEmployeeIdAndDocumentTypeId(
          employeeId,
          documentType._id,
        );

      deletedDocumentIds.push(deletedDocumentId);
    }

    await employee.save();

    return {
      documentTypeIdsUnlinked: documentTypeIds.map((doc) => doc.toString()),
      documentIdsDeleted: deletedDocumentIds.map((doc) => doc._id.toString()),
    };
  }
}
