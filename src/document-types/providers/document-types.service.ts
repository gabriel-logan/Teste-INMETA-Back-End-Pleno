import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { CreateDocumentTypeRequestDto } from "../dto/request/create-document-type.dto";
import { UpdateDocumentTypeRequestDto } from "../dto/request/update-document-type.dto";
import { PublicDocumentTypeResponseDto } from "../dto/response/public-document-type.dto";
import { DocumentType } from "../schemas/document-type.schema";

@Injectable()
export class DocumentTypesService {
  constructor(
    @InjectModel(DocumentType.name)
    private readonly documentTypeModel: Model<DocumentType>,
  ) {}

  async findAll(): Promise<PublicDocumentTypeResponseDto[]> {
    return (await this.documentTypeModel.find().exec()).map((docType) => ({
      id: docType._id,
      name: docType.name,
      createdAt: docType.createdAt,
      updatedAt: docType.updatedAt,
    }));
  }

  async findById(id: string): Promise<PublicDocumentTypeResponseDto> {
    const docType = await this.documentTypeModel.findById(id).exec();

    if (!docType) {
      throw new NotFoundException(`DocumentType with id ${id} not found`);
    }

    return {
      id: docType._id,
      name: docType.name,
      createdAt: docType.createdAt,
      updatedAt: docType.updatedAt,
    };
  }

  async create(
    createDocumentTypeDto: CreateDocumentTypeRequestDto,
  ): Promise<PublicDocumentTypeResponseDto> {
    const { name } = createDocumentTypeDto;

    const newDocumentType = new this.documentTypeModel({
      name,
    });

    const createdDocumentType = await newDocumentType.save();

    return {
      id: createdDocumentType._id,
      name: createdDocumentType.name,
      createdAt: createdDocumentType.createdAt,
      updatedAt: createdDocumentType.updatedAt,
    };
  }

  async update(
    id: string,
    updateDocumentTypeDto: UpdateDocumentTypeRequestDto,
  ): Promise<PublicDocumentTypeResponseDto> {
    const { name } = updateDocumentTypeDto;

    const updatedDocumentType = await this.documentTypeModel.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true },
    );

    if (!updatedDocumentType) {
      throw new NotFoundException(`DocumentType with id ${id} not found`);
    }

    return {
      id: updatedDocumentType._id,
      name: updatedDocumentType.name,
      createdAt: updatedDocumentType.createdAt,
      updatedAt: updatedDocumentType.updatedAt,
    };
  }

  async delete(id: string): Promise<PublicDocumentTypeResponseDto> {
    const deletedDocumentType =
      await this.documentTypeModel.findByIdAndDelete(id);

    if (!deletedDocumentType) {
      throw new NotFoundException(`DocumentType with id ${id} not found`);
    }

    return {
      id: deletedDocumentType._id,
      name: deletedDocumentType.name,
      createdAt: deletedDocumentType.createdAt,
      updatedAt: deletedDocumentType.updatedAt,
    };
  }
}
