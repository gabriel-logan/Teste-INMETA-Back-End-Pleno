import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { cacheKeys } from "src/common/constants";

import { CreateDocumentTypeRequestDto } from "../dto/request/create-document-type.dto";
import { UpdateDocumentTypeRequestDto } from "../dto/request/update-document-type.dto";
import { PublicDocumentTypeResponseDto } from "../dto/response/public-document-type.dto";
import { DocumentType } from "../schemas/document-type.schema";

@Injectable()
export class DocumentTypesService {
  constructor(
    @InjectModel(DocumentType.name)
    private readonly documentTypeModel: Model<DocumentType>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  private toPublicDocumentTypeResponseDto(
    documentType: DocumentType,
  ): PublicDocumentTypeResponseDto {
    return {
      id: documentType._id,
      name: documentType.name,
      createdAt: documentType.createdAt,
      updatedAt: documentType.updatedAt,
    };
  }

  async findAll(): Promise<PublicDocumentTypeResponseDto[]> {
    const cachedDocumentTypes = await this.cacheManager.get<
      PublicDocumentTypeResponseDto[]
    >(cacheKeys.documentTypes.findAll);

    if (cachedDocumentTypes) {
      return cachedDocumentTypes;
    }

    const documentTypes = (await this.documentTypeModel.find().lean()).map(
      (docType) => this.toPublicDocumentTypeResponseDto(docType),
    );

    await this.cacheManager.set(cacheKeys.documentTypes.findAll, documentTypes);

    return documentTypes;
  }

  async findById(
    documentTypeId: string,
  ): Promise<PublicDocumentTypeResponseDto> {
    const cachedDocumentType =
      await this.cacheManager.get<PublicDocumentTypeResponseDto>(
        cacheKeys.documentTypes.findById(documentTypeId),
      );

    if (cachedDocumentType) {
      return cachedDocumentType;
    }

    const docType = await this.documentTypeModel
      .findById(documentTypeId)
      .lean();

    if (!docType) {
      throw new NotFoundException(
        `DocumentType with id ${documentTypeId} not found`,
      );
    }

    await this.cacheManager.set(
      cacheKeys.documentTypes.findById(documentTypeId),
      this.toPublicDocumentTypeResponseDto(docType),
    );

    return this.toPublicDocumentTypeResponseDto(docType);
  }

  async findOneByName(
    documentTypeName: string,
  ): Promise<PublicDocumentTypeResponseDto> {
    const cachedDocumentType =
      await this.cacheManager.get<PublicDocumentTypeResponseDto>(
        cacheKeys.documentTypes.findOneByName(documentTypeName),
      );

    if (cachedDocumentType) {
      return cachedDocumentType;
    }

    const docType = await this.documentTypeModel
      .findOne({ name: documentTypeName.toUpperCase() })
      .lean();

    if (!docType) {
      throw new NotFoundException(
        `DocumentType with name ${documentTypeName} not found`,
      );
    }

    await this.cacheManager.set(
      cacheKeys.documentTypes.findOneByName(documentTypeName),
      this.toPublicDocumentTypeResponseDto(docType),
    );

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

    // Invalidate cache for findAll
    await this.cacheManager.del(cacheKeys.documentTypes.findAll);

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

    // Invalidate cache for findAll and specific document type
    await this.cacheManager.del(cacheKeys.documentTypes.findAll);
    await this.cacheManager.del(
      cacheKeys.documentTypes.findById(documentTypeId),
    );
    await this.cacheManager.del(
      cacheKeys.documentTypes.findOneByName(updatedDocumentType.name),
    );

    return this.toPublicDocumentTypeResponseDto(updatedDocumentType);
  }
}
