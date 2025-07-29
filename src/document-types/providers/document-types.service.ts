import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { cacheKeys } from "src/common/constants";
import { DocumentTypeResponseDto } from "src/common/dto/response/document-type.dto";
import { invalidateKeys, setMultipleKeys } from "src/common/utils/cache-utils";
import getAndSetCache from "src/common/utils/get-and-set.cache";

import { CreateDocumentTypeRequestDto } from "../dto/request/create-document-type.dto";
import { UpdateDocumentTypeRequestDto } from "../dto/request/update-document-type.dto";
import { DocumentType } from "../schemas/document-type.schema";

@Injectable()
export class DocumentTypesService {
  constructor(
    @InjectModel(DocumentType.name)
    private readonly documentTypeModel: Model<DocumentType>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  private genericDocumentTypeResponseMapper(
    documentType: DocumentType,
  ): DocumentTypeResponseDto {
    return {
      _id: documentType._id,
      id: documentType._id.toString(),
      name: documentType.name,
      createdAt: documentType.createdAt,
      updatedAt: documentType.updatedAt,
    };
  }

  private async invalidateDocumentTypeCaches(
    documentType: DocumentTypeResponseDto,
  ): Promise<void> {
    await invalidateKeys(this.cacheManager, [
      cacheKeys.documentTypes.findAll,
      cacheKeys.documentTypes.findById(documentType._id.toString()),
      cacheKeys.documentTypes.findOneByName(documentType.name),
    ]);
  }

  private async setDocumentTypeCaches(
    documentType: DocumentTypeResponseDto,
  ): Promise<void> {
    await setMultipleKeys(this.cacheManager, documentType, [
      cacheKeys.documentTypes.findById(documentType._id.toString()),
      cacheKeys.documentTypes.findOneByName(documentType.name),
    ]);
  }

  async findAll(): Promise<DocumentTypeResponseDto[]> {
    return await getAndSetCache(
      this.cacheManager,
      cacheKeys.documentTypes.findAll,
      async () => {
        return (await this.documentTypeModel.find().lean()).map((docType) =>
          this.genericDocumentTypeResponseMapper(docType),
        );
      },
    );
  }

  async findById(documentTypeId: string): Promise<DocumentTypeResponseDto> {
    return await getAndSetCache(
      this.cacheManager,
      cacheKeys.documentTypes.findById(documentTypeId),
      async () => {
        const docType = await this.documentTypeModel
          .findById(documentTypeId)
          .lean();

        if (!docType) {
          throw new NotFoundException(
            `DocumentType with id ${documentTypeId} not found`,
          );
        }

        return this.genericDocumentTypeResponseMapper(docType);
      },
    );
  }

  async findOneByName(
    documentTypeName: string,
  ): Promise<DocumentTypeResponseDto> {
    return await getAndSetCache(
      this.cacheManager,
      cacheKeys.documentTypes.findOneByName(documentTypeName),
      async () => {
        const docType = await this.documentTypeModel
          .findOne({ name: documentTypeName })
          .lean();

        if (!docType) {
          throw new NotFoundException(
            `DocumentType with name ${documentTypeName} not found`,
          );
        }

        return this.genericDocumentTypeResponseMapper(docType);
      },
    );
  }

  async create(
    createDocumentTypeDto: CreateDocumentTypeRequestDto,
  ): Promise<DocumentTypeResponseDto> {
    const { name } = createDocumentTypeDto;

    const newDocumentType = new this.documentTypeModel({
      name,
    });

    const createdDocumentType = await newDocumentType.save();

    const result = this.genericDocumentTypeResponseMapper(createdDocumentType);

    await Promise.all([
      // Invalidate cache for findAll, findById, and findOneByName
      this.invalidateDocumentTypeCaches(result),

      // Set cache for the newly created document type
      this.setDocumentTypeCaches(result),
    ]);

    return result;
  }

  async update(
    documentTypeId: string,
    updateDocumentTypeDto: UpdateDocumentTypeRequestDto,
  ): Promise<DocumentTypeResponseDto> {
    const { name } = updateDocumentTypeDto;

    const existingDocumentType =
      await this.documentTypeModel.findById(documentTypeId);

    if (!existingDocumentType) {
      throw new NotFoundException(
        `DocumentType with id ${documentTypeId} not found`,
      );
    }

    const previousName = existingDocumentType.name;

    if (name) {
      existingDocumentType.name = name;
    }

    const updatedDocumentType = await existingDocumentType.save();

    const result = this.genericDocumentTypeResponseMapper(updatedDocumentType);

    await Promise.all([
      // Invalidate cache for findAll, findById, and findOneByName
      this.invalidateDocumentTypeCaches(result),
      invalidateKeys(this.cacheManager, [
        cacheKeys.documentTypes.findOneByName(previousName),
      ]),

      // Set cache for the updated document type
      this.setDocumentTypeCaches(result),
    ]);

    return result;
  }
}
