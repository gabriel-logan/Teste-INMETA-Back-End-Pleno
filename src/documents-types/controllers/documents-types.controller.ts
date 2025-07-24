import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { CreateDocumentsTypeRequestDto } from "../dto/request/create-documents-type.dto";
import { UpdateDocumentsTypeRequestDto } from "../dto/request/update-documents-type.dto";
import { DocumentsTypesService } from "../providers/documents-types.service";

@Controller("documents-types")
export class DocumentsTypesController {
  constructor(private readonly documentsTypesService: DocumentsTypesService) {}

  @Get()
  async findAll() {
    return await this.documentsTypesService.findAll();
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    return await this.documentsTypesService.findById(id);
  }

  @Post()
  async create(@Body() createDocumentsTypeDto: CreateDocumentsTypeRequestDto) {
    return await this.documentsTypesService.create(createDocumentsTypeDto);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateDocumentsTypeDto: UpdateDocumentsTypeRequestDto,
  ) {
    return await this.documentsTypesService.update(id, updateDocumentsTypeDto);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return await this.documentsTypesService.delete(id);
  }
}
