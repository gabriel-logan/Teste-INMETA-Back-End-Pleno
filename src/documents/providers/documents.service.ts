import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { DocumentTypesService } from "src/document-types/providers/document-types.service";
import { DocumentType } from "src/document-types/schemas/document-type.schema";
import { EmployeesService } from "src/employees/providers/employees.service";
import { Employee } from "src/employees/schemas/employee.schema";

import { CreateDocumentRequestDto } from "../dto/request/create-document.dto";
import { UpdateDocumentRequestDto } from "../dto/request/update-document.dto";
import { PublicDocumentResponseDto } from "../dto/response/public-document.dto";
import { Document } from "../schemas/document.schema";

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document.name) private readonly documentModel: Model<Document>,
    private readonly documentTypesService: DocumentTypesService,
    private readonly employeesService: EmployeesService,
  ) {}

  private toPublicDocumentResponseDto(
    document: Document & { _id: Types.ObjectId },
  ): PublicDocumentResponseDto {
    return {
      id: document._id,
      employee: document.employee as Employee,
      documentTypes: document.documentTypes as DocumentType[],
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

  async findById(id: string): Promise<PublicDocumentResponseDto> {
    const document = await this.documentModel
      .findById(id)
      .lean()
      .populate("documentType")
      .populate("employee");

    if (!document) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }

    return this.toPublicDocumentResponseDto(document);
  }

  async create(
    createDocumentDto: CreateDocumentRequestDto,
  ): Promise<PublicDocumentResponseDto> {
    const { documentTypeIds, status, employeeId } = createDocumentDto;

    const documentTypes = await Promise.all(
      documentTypeIds.map((id) => this.documentTypesService.findById(id)),
    );

    const employee = await this.employeesService.findById(employeeId);

    const newDocument = new this.documentModel({
      documentTypes: documentTypes.map((docType) => docType.id),
      status,
      employee: employee.id,
    });

    const savedDocument = await newDocument.save();

    return this.toPublicDocumentResponseDto(savedDocument);
  }

  async update(
    id: string,
    updateDocumentDto: UpdateDocumentRequestDto,
  ): Promise<PublicDocumentResponseDto> {
    const { documentTypeIds, status, employeeId } = updateDocumentDto;

    const updateData: Partial<Document> = {};

    if (documentTypeIds && documentTypeIds.length > 0) {
      const docTypes = await Promise.all(
        documentTypeIds.map((id) => this.documentTypesService.findById(id)),
      );
      updateData.documentTypes = docTypes.map((docType) => docType.id);
    }

    if (employeeId) {
      const emp = await this.employeesService.findById(employeeId);
      updateData.employee = emp.id;
    }

    if (status) {
      updateData.status = status;
    }

    const updatedDocument = await this.documentModel
      .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .lean();

    if (!updatedDocument) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }

    return this.toPublicDocumentResponseDto(updatedDocument);
  }

  async delete(id: string): Promise<void> {
    const deletedDocument = await this.documentModel
      .findByIdAndDelete(id)
      .lean();

    if (!deletedDocument) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }

    return void 0;
  }
}
