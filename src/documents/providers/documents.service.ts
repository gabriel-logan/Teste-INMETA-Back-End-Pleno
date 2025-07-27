import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Transactional } from "src/common/decorators/transaction/Transactional";
import { AuthPayload } from "src/common/types";
import type { EnvGlobalConfig } from "src/configs/types";
import { DocumentType } from "src/document-types/schemas/document-type.schema";
import { EmployeesService } from "src/employees/providers/employees.service";
import { Employee, EmployeeRole } from "src/employees/schemas/employee.schema";
import { v4 as uuidv4 } from "uuid";

import { UpdateDocumentRequestDto } from "../dto/request/update-document.dto";
import { PublicDocumentResponseDto } from "../dto/response/public-document.dto";
import { SendDeleteDocumentFileResponseDto } from "../dto/response/send-delete-document-file.dto";
import {
  Document,
  DocumentDocument,
  DocumentStatus,
} from "../schemas/document.schema";

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);
  private readonly baseUrl: string;

  constructor(
    @InjectModel(Document.name) private readonly documentModel: Model<Document>,
    private readonly employeesService: EmployeesService,
    private readonly configService: ConfigService<EnvGlobalConfig, true>,
  ) {
    this.baseUrl =
      this.configService.get<EnvGlobalConfig["server"]>("server").baseUrl;
  }

  private toPublicDocumentResponseDto(
    document: Document,
  ): PublicDocumentResponseDto {
    return {
      id: document._id,
      employee: document.employee as Employee,
      documentType: document.documentType as DocumentType,
      status: document.status,
      documentUrl: document.documentUrl,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }

  async findAll(): Promise<PublicDocumentResponseDto[]> {
    return (
      await this.documentModel
        .find()
        .lean()
        .populate("documentType")
        .populate("employee")
    ).map((doc) => this.toPublicDocumentResponseDto(doc));
  }

  async findById(documentId: string): Promise<PublicDocumentResponseDto> {
    const document = await this.documentModel
      .findById(documentId)
      .lean()
      .populate("documentType")
      .populate("employee");

    if (!document) {
      throw new NotFoundException(`Document with id ${documentId} not found`);
    }

    return this.toPublicDocumentResponseDto(document);
  }

  async update(
    documentId: string,
    updateDocumentDto: UpdateDocumentRequestDto,
  ): Promise<PublicDocumentResponseDto> {
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
      throw new NotFoundException(`Document with id ${documentId} not found`);
    }

    return this.toPublicDocumentResponseDto(updatedDocument);
  }

  private generateDocumentUrl(mimeType: string): string {
    const parsedMimeType = mimeType.split("/")[1];

    const newFileName = uuidv4() + "." + parsedMimeType;

    return `${this.baseUrl}/files/${newFileName}`;
  }

  // DocumentFile is a placeholder for the actual file type
  // Replace it with the actual type used for document files
  @Transactional()
  async sendDocumentFile(
    documentId: string,
    documentFile: Express.Multer.File,
    employee: AuthPayload,
  ): Promise<SendDeleteDocumentFileResponseDto> {
    const document = (await this.documentModel
      .findById(documentId)
      .populate("employee")) as
      | (DocumentDocument & { employee: Employee })
      | null;

    if (!document) {
      throw new NotFoundException(`Document with id ${documentId} not found`);
    }

    // Check if the document is already sent
    if (document.documentUrl) {
      throw new BadRequestException(
        `Document with id ${documentId} has already been sent. If you want to resend it, please delete the existing document and create a new one.`,
      );
    }

    // if its the common employee that is trying to send a document file
    // Verify if the employee is the document owner
    // If not, throw a ForbiddenException
    if (employee.role === EmployeeRole.COMMON) {
      if (document.employee._id !== employee.sub) {
        throw new ForbiddenException(
          `Employee ${employee.username} is not the owner of document ${documentId}`,
        );
      }
    }

    // Logic to send the document (e.g., via email)
    // This is a placeholder for the actual implementation
    this.logger.log(
      `Sending document to employee ${document.employee.firstName}`,
    );
    // Implement the actual

    const documentUrl = this.generateDocumentUrl(documentFile.mimetype);

    document.documentUrl = documentUrl;

    // Update document status to 'sent'
    document.status = DocumentStatus.AVAILABLE;

    await document.save();

    return {
      message: "Document file sent successfully",
      documentUrl,
    };
  }

  @Transactional()
  async deleteDocumentFile(
    documentId: string,
  ): Promise<SendDeleteDocumentFileResponseDto> {
    const document = (await this.documentModel
      .findById(documentId)
      .populate("employee")) as
      | (DocumentDocument & { employee: Employee })
      | null;

    if (!document) {
      throw new NotFoundException(`Document with id ${documentId} not found`);
    }

    if (!document.documentUrl) {
      throw new BadRequestException(
        `Document with id ${documentId} does not have a file to delete.`,
      );
    }

    // Logic to delete the document file (e.g., from cloud storage)
    this.logger.log(
      `Deleting document file for employee ${document.employee.firstName}`,
    );

    const documentUrlBeforeDelete = document.documentUrl;

    document.documentUrl = null;
    document.status = DocumentStatus.MISSING;

    await document.save();

    return {
      message: "Document file deleted successfully",
      documentUrl: documentUrlBeforeDelete,
    };
  }

  async getDocumentStatusesByEmployeeId(
    employeeId: string,
    status?: DocumentStatus,
  ): Promise<
    Record<
      string,
      {
        documentId: string;
        status: DocumentStatus;
      }
    >
  > {
    const employee = await this.employeesService.findById(employeeId);

    const documents = (await this.documentModel
      .find({ employee: employee.id })
      .populate("documentType")
      .lean()) as (Document & { documentType: DocumentType })[];

    if (documents.length === 0) {
      throw new NotFoundException(
        `No documents found for employee with id ${employeeId}`,
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
        `No documents found for employee with id ${employeeId} with status ${status}`,
      );
    }

    return documentStatuses;
  }

  async getAllMissingDocuments(
    page = 1,
    limit = 10,
    employeeId?: string,
    documentTypeId?: string,
  ): Promise<{
    documents: PublicDocumentResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const filters: Record<string, any> = {
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
      documents: documents.map((doc) => this.toPublicDocumentResponseDto(doc)),
      total,
      page,
      limit,
    };
  }
}
