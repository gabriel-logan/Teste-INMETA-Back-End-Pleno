import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { CreateDocumentTypeRequestDto } from "../dto/request/create-document-type.dto";
import { UpdateDocumentTypeRequestDto } from "../dto/request/update-document-type.dto";
import { PublicDocumentTypeResponseDto } from "../dto/response/public-document-type.dto";
import { DocumentType } from "../schemas/document-type.schema";

@Injectable()
export class DocumentsTypesService {
  constructor(
    @InjectModel(DocumentType.name)
    private readonly documentsTypeModel: Model<DocumentType>,
  ) {}

  async findAll(): Promise<PublicDocumentTypeResponseDto[]> {
    return (await this.documentsTypeModel.find().exec()).map((docType) => ({
      id: docType._id,
      name: docType.name,
      createdAt: docType.createdAt,
      updatedAt: docType.updatedAt,
    }));
  }

  async findById(id: string): Promise<PublicDocumentTypeResponseDto> {
    const docType = await this.documentsTypeModel.findById(id).exec();

    if (!docType) {
      throw new NotFoundException(`DocumentsType with id ${id} not found`);
    }

    return {
      id: docType._id,
      name: docType.name,
      createdAt: docType.createdAt,
      updatedAt: docType.updatedAt,
    };
  }

  async create(
    createDocumentsTypeDto: CreateDocumentTypeRequestDto,
  ): Promise<PublicDocumentTypeResponseDto> {
    const { name } = createDocumentsTypeDto;

    const newDocumentsType = new this.documentsTypeModel({
      name,
    });

    const createdDocumentsType = await newDocumentsType.save();

    return {
      id: createdDocumentsType._id,
      name: createdDocumentsType.name,
      createdAt: createdDocumentsType.createdAt,
      updatedAt: createdDocumentsType.updatedAt,
    };
  }

  async update(
    id: string,
    updateDocumentsTypeDto: UpdateDocumentTypeRequestDto,
  ): Promise<PublicDocumentTypeResponseDto> {
    const { name } = updateDocumentsTypeDto;

    const updatedDocumentsType =
      await this.documentsTypeModel.findByIdAndUpdate(
        id,
        { name },
        { new: true, runValidators: true },
      );

    if (!updatedDocumentsType) {
      throw new NotFoundException(`DocumentsType with id ${id} not found`);
    }

    return {
      id: updatedDocumentsType._id,
      name: updatedDocumentsType.name,
      createdAt: updatedDocumentsType.createdAt,
      updatedAt: updatedDocumentsType.updatedAt,
    };
  }

  async delete(id: string): Promise<PublicDocumentTypeResponseDto> {
    const deletedDocumentsType =
      await this.documentsTypeModel.findByIdAndDelete(id);

    if (!deletedDocumentsType) {
      throw new NotFoundException(`DocumentsType with id ${id} not found`);
    }

    return {
      id: deletedDocumentsType._id,
      name: deletedDocumentsType.name,
      createdAt: deletedDocumentsType.createdAt,
      updatedAt: deletedDocumentsType.updatedAt,
    };
  }
}
