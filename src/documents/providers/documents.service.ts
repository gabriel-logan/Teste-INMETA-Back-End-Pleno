import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DocumentTypesService } from "src/document-types/providers/document-types.service";

import { CreateDocumentRequestDto } from "../dto/request/create-document.dto";
import { UpdateDocumentRequestDto } from "../dto/request/update-document.dto";
import { PublicDocumentResponseDto } from "../dto/response/public-document.dto";
import { Document } from "../schemas/document.schema";

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document.name) private readonly documentModel: Model<Document>,
    private readonly documentTypesService: DocumentTypesService,
  ) {}

  async findAll(): Promise<PublicDocumentResponseDto[]> {
    return (
      await this.documentModel.find().populate("documentType").exec()
    ).map((doc) => ({
      id: doc._id,
      documentType: doc.documentType,
      status: doc.status,
      url: doc.url,
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
      url: document.url,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }

  async create(
    createDocumentDto: CreateDocumentRequestDto,
  ): Promise<PublicDocumentResponseDto> {
    const { documentTypeId, status } = createDocumentDto;

    const documentType = await this.documentTypesService.findById(
      documentTypeId.toString(),
    );

    const newDocument = new this.documentModel({
      documentType: documentType.id,
      status,
    });

    const savedDocument = await newDocument.save();

    return {
      id: savedDocument._id,
      documentType: savedDocument.documentType,
      status: savedDocument.status,
      url: savedDocument.url,
      createdAt: savedDocument.createdAt,
      updatedAt: savedDocument.updatedAt,
    };
  }

  async update(
    id: string,
    updateDocumentDto: UpdateDocumentRequestDto,
  ): Promise<PublicDocumentResponseDto> {
    const { documentTypeId, status } = updateDocumentDto;

    let documentType = { id: documentTypeId };

    if (documentTypeId) {
      documentType = await this.documentTypesService.findById(
        documentTypeId.toString(),
      );
    }

    const updatedDocument = await this.documentModel
      .findByIdAndUpdate(
        id,
        { documentType: documentType.id, status },
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
      url: updatedDocument.url,
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
      url: deletedDocument.url,
      createdAt: deletedDocument.createdAt,
      updatedAt: deletedDocument.updatedAt,
    };
  }
}
