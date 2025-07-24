import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { CreateDocumentsTypeRequestDto } from "../dto/request/create-documents-type.dto";
import { UpdateDocumentsTypeRequestDto } from "../dto/request/update-documents-type.dto";
import { PublicDocumentsTypeResponseDto } from "../dto/response/public-documents-type.dto";
import { DocumentsType } from "../schemas/documents-type.schema";

@Injectable()
export class DocumentsTypesService {
  constructor(
    @InjectModel(DocumentsType.name)
    private readonly documentsTypeModel: Model<DocumentsType>,
  ) {}

  async findAll(): Promise<PublicDocumentsTypeResponseDto[]> {
    return (await this.documentsTypeModel.find().exec()).map((docType) => ({
      id: docType._id,
      name: docType.name,
      createdAt: docType.createdAt,
      updatedAt: docType.updatedAt,
    }));
  }

  async findById(id: string): Promise<PublicDocumentsTypeResponseDto> {
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
    createDocumentsTypeDto: CreateDocumentsTypeRequestDto,
  ): Promise<PublicDocumentsTypeResponseDto> {
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
    updateDocumentsTypeDto: UpdateDocumentsTypeRequestDto,
  ): Promise<PublicDocumentsTypeResponseDto> {
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

  async delete(id: string): Promise<PublicDocumentsTypeResponseDto> {
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
