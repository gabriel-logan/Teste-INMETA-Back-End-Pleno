import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { cacheKeys } from "src/common/constants";
import getAndSetCache from "src/common/utils/get-and-set.cache";

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

  private async invalidateDocumentTypesCache(
    id: string,
    name: string,
  ): Promise<void> {
    await this.cacheManager.del(cacheKeys.documentTypes.findAll);
    await this.cacheManager.del(cacheKeys.documentTypes.findById(id));
    await this.cacheManager.del(
      cacheKeys.documentTypes.findOneByName(name.toUpperCase()),
    );
  }

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
    return await getAndSetCache(
      this.cacheManager,
      cacheKeys.documentTypes.findAll,
      async () => {
        return (await this.documentTypeModel.find().lean()).map((docType) =>
          this.toPublicDocumentTypeResponseDto(docType),
        );
      },
    );
  }

  async findById(
    documentTypeId: string,
  ): Promise<PublicDocumentTypeResponseDto> {
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

        return this.toPublicDocumentTypeResponseDto(docType);
      },
    );
  }

  async findOneByName(
    documentTypeName: string,
  ): Promise<PublicDocumentTypeResponseDto> {
    return await getAndSetCache(
      this.cacheManager,
      cacheKeys.documentTypes.findOneByName(documentTypeName.toUpperCase()),
      async () => {
        const docType = await this.documentTypeModel
          .findOne({ name: documentTypeName.toUpperCase() })
          .lean();

        if (!docType) {
          throw new NotFoundException(
            `DocumentType with name ${documentTypeName} not found`,
          );
        }

        return this.toPublicDocumentTypeResponseDto(docType);
      },
    );
  }

  async create(
    createDocumentTypeDto: CreateDocumentTypeRequestDto,
  ): Promise<PublicDocumentTypeResponseDto> {
    const { name } = createDocumentTypeDto;

    const newDocumentType = new this.documentTypeModel({
      name,
    });

    const createdDocumentType = await newDocumentType.save();

    // Invalidate cache for findAll, findById, and findOneByName
    await this.invalidateDocumentTypesCache(
      createdDocumentType._id.toString(),
      createdDocumentType.name,
    );

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

    // Invalidate cache for findAll, findById, and findOneByName
    await this.invalidateDocumentTypesCache(
      updatedDocumentType._id.toString(),
      updatedDocumentType.name,
    );
    // Invalidate cache for the old name
    if (name) {
      await this.cacheManager.del(
        cacheKeys.documentTypes.findOneByName(name.toUpperCase()),
      );
    }

    // Set cache for the updated document type
    await this.cacheManager.set(
      cacheKeys.documentTypes.findById(updatedDocumentType._id.toString()),
      this.toPublicDocumentTypeResponseDto(updatedDocumentType),
    );
    await this.cacheManager.set(
      cacheKeys.documentTypes.findOneByName(updatedDocumentType.name),
      this.toPublicDocumentTypeResponseDto(updatedDocumentType),
    );

    return this.toPublicDocumentTypeResponseDto(updatedDocumentType);
  }
}
