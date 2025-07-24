import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DocumentTypesService } from "src/document-types/providers/document-types.service";
import { EmployeesService } from "src/employees/providers/employees.service";

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

  async findAll(): Promise<PublicDocumentResponseDto[]> {
    return (
      await this.documentModel
        .find()
        .populate("documentType")
        .populate("employee")
        .exec()
    ).map((doc) => ({
      id: doc._id,
      employee: doc.employee,
      documentType: doc.documentType,
      status: doc.status,
      documentUrl: doc.documentUrl,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
  }

  async findById(id: string): Promise<PublicDocumentResponseDto> {
    const document = await this.documentModel
      .findById(id)
      .populate("documentType")
      .populate("employee")
      .exec();

    if (!document) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }

    return {
      id: document._id,
      employee: document.employee,
      documentType: document.documentType,
      status: document.status,
      documentUrl: document.documentUrl,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }

  async create(
    createDocumentDto: CreateDocumentRequestDto,
  ): Promise<PublicDocumentResponseDto> {
    const { documentTypeId, status, employeeId } = createDocumentDto;

    const documentType = await this.documentTypesService.findById(
      documentTypeId.toString(),
    );

    const employee = await this.employeesService.findById(
      employeeId.toString(),
    );

    const newDocument = new this.documentModel({
      documentType: documentType.id,
      status,
      employee: employee.id,
    });

    const savedDocument = await newDocument.save();

    return {
      id: savedDocument._id,
      employee: savedDocument.employee,
      documentType: savedDocument.documentType,
      status: savedDocument.status,
      documentUrl: savedDocument.documentUrl,
      createdAt: savedDocument.createdAt,
      updatedAt: savedDocument.updatedAt,
    };
  }

  async update(
    id: string,
    updateDocumentDto: UpdateDocumentRequestDto,
  ): Promise<PublicDocumentResponseDto> {
    const { documentTypeId, status, employeeId } = updateDocumentDto;

    let documentType = { id: documentTypeId };
    let employee = { id: employeeId };

    if (documentTypeId) {
      documentType = await this.documentTypesService.findById(
        documentTypeId.toString(),
      );
    }

    if (employeeId) {
      employee = await this.employeesService.findById(employeeId.toString());
    }

    const updatedDocument = await this.documentModel
      .findByIdAndUpdate(
        id,
        { documentType: documentType.id, status, employee: employee.id },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updatedDocument) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }

    return {
      id: updatedDocument._id,
      employee: updatedDocument.employee,
      documentType: updatedDocument.documentType,
      status: updatedDocument.status,
      documentUrl: updatedDocument.documentUrl,
      createdAt: updatedDocument.createdAt,
      updatedAt: updatedDocument.updatedAt,
    };
  }

  async delete(id: string): Promise<void> {
    const deletedDocument = await this.documentModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedDocument) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }

    return void 0;
  }
}
