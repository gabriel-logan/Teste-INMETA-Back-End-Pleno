import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { DocumentsTypesService } from "./documents-types.service";
import { CreateDocumentsTypeDto } from "./dto/create-documents-type.dto";
import { UpdateDocumentsTypeDto } from "./dto/update-documents-type.dto";

@Controller("documents-types")
export class DocumentsTypesController {
  constructor(private readonly documentsTypesService: DocumentsTypesService) {}

  @Post()
  create(@Body() createDocumentsTypeDto: CreateDocumentsTypeDto) {
    return this.documentsTypesService.create(createDocumentsTypeDto);
  }

  @Get()
  findAll() {
    return this.documentsTypesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.documentsTypesService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateDocumentsTypeDto: UpdateDocumentsTypeDto,
  ) {
    return this.documentsTypesService.update(+id, updateDocumentsTypeDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.documentsTypesService.remove(+id);
  }
}
