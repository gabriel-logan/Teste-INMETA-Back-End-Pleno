import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { DocumentFullResponseDto } from "src/common/dto/response/document.dto";
import { DocumentTypeAllowedValues } from "src/document-types/schemas/document-type.schema";
import { EmployeesService } from "src/employees/providers/employees.service";

import { UpdateDocumentRequestDto } from "../dto/request/update-document.dto";
import { GetAllMissingDocumentsQueriesResponseDto } from "../dto/response/get-all-missing-documents-queries.dto";
import { GetDocumentStatusesByEmployeeIdResponseDto } from "../dto/response/get-document-statuses-by-employeeId.dto";
import {
  Document,
  DocumentDocument,
  DocumentStatus,
} from "../schemas/document.schema";

type DocumentsPopulatableFields = "documentType" | "employee";

type FindOptions<T extends boolean> = {
  populates?: DocumentsPopulatableFields[];
  lean?: T;
};

type DocumentFilters = {
  byEmployeeId?: Types.ObjectId;
  byDocumentTypeId?: Types.ObjectId;
  byStatus?: DocumentStatus;
};

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    @InjectModel(Document.name) private readonly documentModel: Model<Document>,
    private readonly employeesService: EmployeesService,
  ) {}

  private genericDocumentResponseMapper(
    document: Document,
  ): DocumentFullResponseDto {
    return {
      _id: document._id,
      id: document._id.toString(),
      employee: {
        _id: document.employee._id,
        id: document.employee._id.toString(),
        firstName: document.employee.firstName,
        lastName: document.employee.lastName,
        fullName: document.employee.fullName,
        username: document.employee.username,
        contractStatus: document.employee.contractStatus,
        cpf: document.employee.cpf,
        role: document.employee.role,
        createdAt: document.employee.createdAt,
        updatedAt: document.employee.updatedAt,
      },
      documentType: {
        _id: document.documentType._id,
        id: document.documentType._id.toString(),
        name: document.documentType.name,
        createdAt: document.documentType.createdAt,
        updatedAt: document.documentType.updatedAt,
      },
      status: document.status,
      documentUrl: document.documentUrl,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }

  async findAll(
    filters?: DocumentFilters,
    options?: FindOptions<true>,
  ): Promise<Document[]>;

  async findAll(
    filters?: DocumentFilters,
    options?: FindOptions<false>,
  ): Promise<DocumentDocument[]>;

  async findAll(
    filters: DocumentFilters = {},
    options: FindOptions<boolean> = {},
  ): Promise<(Document | DocumentDocument)[]> {
    const { byEmployeeId, byDocumentTypeId, byStatus } = filters;
    const { populates = [], lean = true } = options;

    const filter: Record<string, any> = {};

    if (byEmployeeId) {
      filter.employee = byEmployeeId;
    }

    if (byDocumentTypeId) {
      filter.documentType = byDocumentTypeId;
    }

    if (byStatus) {
      filter.status = byStatus;
    }

    let query = this.documentModel.find(filter);

    for (const populate of populates) {
      query = query.populate(populate);
    }

    const documents = await (lean ? query.lean() : query);

    return documents;
  }

  async findAllWithDocumentTypeAndEmployee(): Promise<
    DocumentFullResponseDto[]
  > {
    const documents = await this.findAll(undefined, {
      populates: ["documentType", "employee"],
    });

    return documents.map((doc) => this.genericDocumentResponseMapper(doc));
  }

  async findById(
    documentId: Types.ObjectId,
    options?: FindOptions<true>,
  ): Promise<Document>;

  async findById(
    documentId: Types.ObjectId,
    options?: FindOptions<false>,
  ): Promise<DocumentDocument>;

  async findById(
    documentId: Types.ObjectId,
    options: FindOptions<boolean> = {},
  ): Promise<Document | DocumentDocument> {
    const { populates = [], lean = true } = options;

    let query = this.documentModel.findById(documentId);

    for (const populate of populates) {
      query = query.populate(populate);
    }

    const document = await (lean ? query.lean() : query);

    if (!document) {
      throw new NotFoundException(
        `Document with id ${documentId.toString()} not found`,
      );
    }

    return document;
  }

  async findByIdWithDocumentTypeAndEmployee(
    documentId: Types.ObjectId,
  ): Promise<DocumentFullResponseDto> {
    const document = await this.findById(documentId, {
      populates: ["documentType", "employee"],
    });

    return this.genericDocumentResponseMapper(document);
  }

  async update(
    documentId: Types.ObjectId,
    updateDocumentDto: UpdateDocumentRequestDto,
  ): Promise<DocumentFullResponseDto> {
    const { status } = updateDocumentDto;

    const updatedDocument = await this.documentModel
      .findByIdAndUpdate(
        documentId,
        { status },
        {
          new: true,
          runValidators: true,
        },
      )
      .lean();

    if (!updatedDocument) {
      throw new NotFoundException(
        `Document with id ${documentId.toString()} not found`,
      );
    }

    return this.genericDocumentResponseMapper(updatedDocument);
  }

  async getDocumentStatusesByEmployeeId(
    employeeId: Types.ObjectId,
    status?: DocumentStatus,
  ): Promise<GetDocumentStatusesByEmployeeIdResponseDto> {
    const employee = await this.employeesService.findById(employeeId);

    const documents = await this.findAll(
      { byEmployeeId: employee._id },
      {
        populates: ["documentType"],
      },
    );

    if (documents.length === 0) {
      throw new NotFoundException(
        `No documents found for employee with id ${employeeId.toString()}`,
      );
    }

    const documentStatuses: Record<
      string,
      { documentId: string; status: DocumentStatus }
    > = {};

    documents.forEach((doc) => {
      documentStatuses[doc.documentType.name] = {
        documentId: doc._id.toString(),
        status: doc.status,
      };
    });

    // If a specific status is requested, filter the results
    if (status) {
      for (const key in documentStatuses) {
        if (documentStatuses[key].status !== status) {
          delete documentStatuses[key];
        }
      }
    }

    // If no documents match the requested status, throw an error
    if (Object.keys(documentStatuses).length === 0) {
      throw new NotFoundException(
        `No documents found for employee with id ${employeeId.toString()} with status ${status}`,
      );
    }

    return {
      documentStatuses: Object.entries(documentStatuses).map(
        ([documentName, documentStatus]) => ({
          documentName: documentName as DocumentTypeAllowedValues,
          documentStatus: {
            documentId: documentStatus.documentId,
            status: documentStatus.status,
          },
        }),
      ),
    };
  }

  async getAllMissingDocuments(
    page = 1,
    limit = 10,
    employeeId?: Types.ObjectId,
    documentTypeId?: Types.ObjectId,
  ): Promise<GetAllMissingDocumentsQueriesResponseDto> {
    const filters: Partial<Record<keyof Document, any>> = {
      status: DocumentStatus.MISSING,
    };

    if (employeeId) {
      filters["employee"] = employeeId;
    }

    if (documentTypeId) {
      filters["documentType"] = documentTypeId;
    }

    const [documents, total] = await Promise.all([
      this.documentModel
        .find(filters)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("employee")
        .populate("documentType")
        .lean(),
      this.documentModel.countDocuments(filters).lean(),
    ]);

    return {
      documents: documents.map((doc) => {
        return this.genericDocumentResponseMapper(doc);
      }),
      total,
      page,
      limit,
    };
  }
}
