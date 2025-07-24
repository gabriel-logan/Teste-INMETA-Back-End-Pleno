import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { CreateDocumentRequestDto } from "../dto/request/create-document.dto";
import { UpdateDocumentRequestDto } from "../dto/request/update-document.dto";
import { PublicDocumentResponseDto } from "../dto/response/public-document.dto";
import { DocumentsService } from "../providers/documents.service";

@Controller("documents")
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  async findAll(): Promise<PublicDocumentResponseDto[]> {
    return await this.documentsService.findAll();
  }

  @Get(":id")
  async findById(@Param("id") id: string): Promise<PublicDocumentResponseDto> {
    return await this.documentsService.findById(id);
  }

  @Post()
  async create(
    @Body() createDocumentDto: CreateDocumentRequestDto,
  ): Promise<PublicDocumentResponseDto> {
    return await this.documentsService.create(createDocumentDto);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateDocumentDto: UpdateDocumentRequestDto,
  ): Promise<PublicDocumentResponseDto> {
    return await this.documentsService.update(id, updateDocumentDto);
  }

  @Delete(":id")
  async delete(@Param("id") id: string): Promise<PublicDocumentResponseDto> {
    return await this.documentsService.delete(id);
  }
}
