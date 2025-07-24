import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { CreateDocumentRequestDto } from "../dto/request/create-document.dto";
import { UpdateDocumentRequestDto } from "../dto/request/update-document.dto";
import { PublicDocumentResponseDto } from "../dto/response/public-document.dto";
import { Document } from "../schemas/document.schema";

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document.name) private readonly documentModel: Model<Document>,
  ) {}

  async findAll(): Promise<PublicDocumentResponseDto[]> {
    return (
      await this.documentModel.find().populate("documentType").exec()
    ).map((doc) => ({
      id: doc._id,
      name: doc.name,
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
      name: document.name,
      documentType: document.documentType,
      status: document.status,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }

  async create(
    createDocumentDto: CreateDocumentRequestDto,
  ): Promise<PublicDocumentResponseDto> {
    const { name, documentTypeId, status } = createDocumentDto;

    const newDocument = new this.documentModel({
      name,
      documentType: documentTypeId,
      status,
    });

    const savedDocument = await newDocument.save();

    return {
      id: savedDocument._id,
      name: savedDocument.name,
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
    const { name } = updateDocumentDto;

    const updatedDocument = await this.documentModel
      .findByIdAndUpdate(id, { name }, { new: true, runValidators: true })
      .exec();

    if (!updatedDocument) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }

    return {
      id: updatedDocument._id,
      name: updatedDocument.name,
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
      name: deletedDocument.name,
      documentType: deletedDocument.documentType,
      status: deletedDocument.status,
      createdAt: deletedDocument.createdAt,
      updatedAt: deletedDocument.updatedAt,
    };
  }
}
