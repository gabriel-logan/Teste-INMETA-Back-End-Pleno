import { Injectable } from "@nestjs/common";
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
    return `This action returns all documentsTypes`;
  }

  async findById(id: string): Promise<PublicDocumentsTypeResponseDto> {
    return `This action returns a #${id} documentsType`;
  }

  async create(
    createDocumentsTypeDto: CreateDocumentsTypeRequestDto,
  ): Promise<PublicDocumentsTypeResponseDto> {
    return "This action adds a new documentsType";
  }

  async update(
    id: string,
    updateDocumentsTypeDto: UpdateDocumentsTypeRequestDto,
  ): Promise<PublicDocumentsTypeResponseDto> {
    return `This action updates a #${id} documentsType`;
  }

  async delete(id: string): Promise<PublicDocumentsTypeResponseDto> {
    return `This action removes a #${id} documentsType`;
  }
}
