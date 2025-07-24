import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DocumentType } from "src/document-types/schemas/document-type.schema";

import { CreateDocumentRequestDto } from "../dto/request/create-document.dto";
import { UpdateDocumentRequestDto } from "../dto/request/update-document.dto";
import { PublicDocumentResponseDto } from "../dto/response/public-document.dto";
import { Document } from "../schemas/document.schema";

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document.name) private readonly documentModel: Model<Document>,
    @InjectModel(DocumentType.name)
    private readonly documentTypeModel: Model<DocumentType>,
  ) {}

  async findAll(): Promise<PublicDocumentResponseDto[]> {
    return (
      await this.documentModel.find().populate("documentType").exec()
    ).map((doc) => ({
      id: doc._id,
      documentType: doc.documentType,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
  }

  async findById(id: string): Promise<PublicDocumentResponseDto> {
    const document = await this.documentModel
      .findById(id)
      .populate("documentType")
      .exec();

    if (!document) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }

    return {
      id: document._id,
      documentType: document.documentType,
      status: document.status,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }

  async create(
    createDocumentDto: CreateDocumentRequestDto,
  ): Promise<PublicDocumentResponseDto> {
    const { documentTypeId, status } = createDocumentDto;

    const documentType = await this.documentTypeModel
      .findById(documentTypeId)
      .exec();

    if (!documentType) {
      throw new NotFoundException(
        `DocumentType with id ${documentTypeId.toString()} not found`,
      );
    }

    const newDocument = new this.documentModel({
      documentType: documentType,
      status,
    });

    const savedDocument = await newDocument.save();

    return {
      id: savedDocument._id,
      documentType: savedDocument.documentType,
      status: savedDocument.status,
      createdAt: savedDocument.createdAt,
      updatedAt: savedDocument.updatedAt,
    };
  }

  async update(
    id: string,
    updateDocumentDto: UpdateDocumentRequestDto,
  ): Promise<PublicDocumentResponseDto> {
    const { documentTypeId, status } = updateDocumentDto;

    const updatedDocument = await this.documentModel
      .findByIdAndUpdate(
        id,
        { documentType: documentTypeId, status },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updatedDocument) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }

    return {
      id: updatedDocument._id,
      documentType: updatedDocument.documentType,
      status: updatedDocument.status,
      createdAt: updatedDocument.createdAt,
      updatedAt: updatedDocument.updatedAt,
    };
  }

  async delete(id: string): Promise<PublicDocumentResponseDto> {
    const deletedDocument = await this.documentModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedDocument) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }

    return {
      id: deletedDocument._id,
      documentType: deletedDocument.documentType,
      status: deletedDocument.status,
      createdAt: deletedDocument.createdAt,
      updatedAt: deletedDocument.updatedAt,
    };
  }
}
