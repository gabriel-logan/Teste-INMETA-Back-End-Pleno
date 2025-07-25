import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import type { EnvGlobalConfig } from "src/configs/types";
import { DocumentTypesService } from "src/document-types/providers/document-types.service";
import { DocumentType } from "src/document-types/schemas/document-type.schema";
import { EmployeesService } from "src/employees/providers/employees.service";
import { Employee } from "src/employees/schemas/employee.schema";
import { v4 as uuidv4 } from "uuid";

import { CreateDocumentRequestDto } from "../dto/request/create-document.dto";
import { UpdateDocumentRequestDto } from "../dto/request/update-document.dto";
import { PublicDocumentResponseDto } from "../dto/response/public-document.dto";
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
    private readonly documentTypesService: DocumentTypesService,
    private readonly employeesService: EmployeesService,
    private readonly configService: ConfigService<EnvGlobalConfig, true>,
  ) {
    this.baseUrl =
      this.configService.get<EnvGlobalConfig["server"]>("server").baseUrl;
  }

  private toPublicDocumentResponseDto(
    document: Document & { _id: Types.ObjectId },
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

  async create(
    createDocumentDto: CreateDocumentRequestDto,
  ): Promise<PublicDocumentResponseDto> {
    const { documentTypeId, status, employeeId } = createDocumentDto;

    const documentType =
      await this.documentTypesService.findById(documentTypeId);

    const employee = await this.employeesService.findById(employeeId);

    // Check if the document type is linked to the employee
    const isLinkedDocumentType = employee.documentTypes
      .map((docType) => docType.name)
      .includes(documentType.name);

    if (!isLinkedDocumentType) {
      throw new NotFoundException(
        `Document type id ${documentTypeId} is not linked to employee ${employeeId}`,
      );
    }

    // Check if the employee already has a document of this type
    const existingDocument = await this.documentModel.findOne({
      employee: employee.id,
      documentType: documentType.id,
    });

    if (existingDocument) {
      throw new NotFoundException(
        `Employee ${employeeId} already has a document of type ${documentTypeId}`,
      );
    }

    const newDocument = new this.documentModel({
      documentType: documentType.id,
      status,
      employee: employee.id,
    });

    const savedDocument = await newDocument.save();

    return this.toPublicDocumentResponseDto(savedDocument);
  }

  async update(
    documentId: string,
    updateDocumentDto: UpdateDocumentRequestDto,
  ): Promise<PublicDocumentResponseDto> {
    const { documentTypeId, status, employeeId } = updateDocumentDto;

    const updateData: Partial<Document> = {};

    if (documentTypeId) {
      const documentType =
        await this.documentTypesService.findById(documentTypeId);
      updateData.documentType = documentType.id;
    }

    if (employeeId) {
      const emp = await this.employeesService.findById(employeeId);
      updateData.employee = emp.id;
    }

    if (status) {
      updateData.status = status;
    }

    const updatedDocument = await this.documentModel
      .findByIdAndUpdate(documentId, updateData, {
        new: true,
        runValidators: true,
      })
      .lean();

    if (!updatedDocument) {
      throw new NotFoundException(`Document with id ${documentId} not found`);
    }

    return this.toPublicDocumentResponseDto(updatedDocument);
  }

  async delete(documentId: string): Promise<void> {
    const deletedDocument = await this.documentModel
      .findByIdAndDelete(documentId)
      .lean();

    if (!deletedDocument) {
      throw new NotFoundException(`Document with id ${documentId} not found`);
    }

    return void 0;
  }

  private generateDocumentUrl(mimeType: string): string {
    const parsedMimeType = mimeType.split("/")[1];

    const newFileName = uuidv4() + "." + parsedMimeType;

    return `${this.baseUrl}/${newFileName}`;
  }

  // DocumentFile is a placeholder for the actual file type
  // Replace it with the actual type used for document files
  async sendDocumentFile(
    documentId: string,
    documentFile: Express.Multer.File,
  ): Promise<void> {
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

    // Logic to send the document (e.g., via email)
    // This is a placeholder for the actual implementation
    this.logger.log(`Sending document to employee ${document.employee.name}`);
    // Implement the actual

    const documentUrl = this.generateDocumentUrl(documentFile.mimetype);

    document.documentUrl = documentUrl;

    // Update document status to 'sent'
    document.status = DocumentStatus.AVAILABLE;

    await document.save();
  }

  async deleteDocumentFile(documentId: string): Promise<void> {
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
      `Deleting document file for employee ${document.employee.name}`,
    );

    document.documentUrl = null;
    document.status = DocumentStatus.MISSING;

    await document.save();
  }
}
