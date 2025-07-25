import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

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

  private toPublicDocumentTypeResponseDto(
    documentType: DocumentType & { _id: Types.ObjectId },
  ): PublicDocumentTypeResponseDto {
    return {
      id: documentType._id,
      name: documentType.name,
      createdAt: documentType.createdAt,
      updatedAt: documentType.updatedAt,
    };
  }

  async findAll(): Promise<PublicDocumentTypeResponseDto[]> {
    return (await this.documentTypeModel.find().lean()).map((docType) =>
      this.toPublicDocumentTypeResponseDto(docType),
    );
  }

  async findById(
    documentTypeId: string,
  ): Promise<PublicDocumentTypeResponseDto> {
    const docType = await this.documentTypeModel
      .findById(documentTypeId)
      .lean();

    if (!docType) {
      throw new NotFoundException(
        `DocumentType with id ${documentTypeId} not found`,
      );
    }

    return this.toPublicDocumentTypeResponseDto(docType);
  }

  async create(
    createDocumentTypeDto: CreateDocumentTypeRequestDto,
  ): Promise<PublicDocumentTypeResponseDto> {
    const { name } = createDocumentTypeDto;

    const newDocumentType = new this.documentTypeModel({
      name,
    });

    const createdDocumentType = await newDocumentType.save();

    return this.toPublicDocumentTypeResponseDto(createdDocumentType);
  }

  async update(
    documentTypeId: string,
    updateDocumentTypeDto: UpdateDocumentTypeRequestDto,
  ): Promise<PublicDocumentTypeResponseDto> {
    const { name } = updateDocumentTypeDto;

    const updatedDocumentType = await this.documentTypeModel
      .findByIdAndUpdate(
        documentTypeId,
        { name },
        { new: true, runValidators: true },
      )
      .lean();

    if (!updatedDocumentType) {
      throw new NotFoundException(
        `DocumentType with id ${documentTypeId} not found`,
      );
    }

    return this.toPublicDocumentTypeResponseDto(updatedDocumentType);
  }

  async delete(documentTypeId: string): Promise<void> {
    const deletedDocumentType = await this.documentTypeModel
      .findByIdAndDelete(documentTypeId)
      .lean();

    if (!deletedDocumentType) {
      throw new NotFoundException(
        `DocumentType with id ${documentTypeId} not found`,
      );
    }

    return void 0;
  }
}
