import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import {
  ApiGlobalErrorResponses,
  ApiStandardResponses,
} from "src/common/decorators/routes/docs";

import { CreateDocumentTypeRequestDto } from "../dto/request/create-document-type.dto";
import { UpdateDocumentTypeRequestDto } from "../dto/request/update-document-type.dto";
import { PublicDocumentTypeResponseDto } from "../dto/response/public-document-type.dto";
import { DocumentsTypesService } from "../providers/documents-types.service";

@ApiGlobalErrorResponses()
@Controller("documents-types")
export class DocumentsTypesController {
  constructor(private readonly documentsTypesService: DocumentsTypesService) {}

  @ApiStandardResponses({
    ok: {
      description: "Returns a list of all documents types.",
      type: PublicDocumentTypeResponseDto,
      isArray: true,
    },
  })
  @Get()
  async findAll(): Promise<PublicDocumentTypeResponseDto[]> {
    return await this.documentsTypesService.findAll();
  }

  @ApiStandardResponses({
    ok: {
      description: "Returns a specific documents type by ID.",
      type: PublicDocumentTypeResponseDto,
    },
    notFound: true,
  })
  @Get(":id")
  async findById(
    @Param("id") id: string,
  ): Promise<PublicDocumentTypeResponseDto> {
    return await this.documentsTypesService.findById(id);
  }

  @ApiStandardResponses({
    ok: {
      description: "Creates a new documents type.",
      type: PublicDocumentTypeResponseDto,
      statusCode: HttpStatus.CREATED,
    },
    badRequest: true,
  })
  @Post()
  async create(
    @Body() createDocumentsTypeDto: CreateDocumentTypeRequestDto,
  ): Promise<PublicDocumentTypeResponseDto> {
    return await this.documentsTypesService.create(createDocumentsTypeDto);
  }

  @ApiStandardResponses({
    ok: {
      description: "Updates an existing documents type.",
      type: PublicDocumentTypeResponseDto,
    },
    notFound: true,
    badRequest: true,
  })
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateDocumentsTypeDto: UpdateDocumentTypeRequestDto,
  ): Promise<PublicDocumentTypeResponseDto> {
    return await this.documentsTypesService.update(id, updateDocumentsTypeDto);
  }

  @ApiStandardResponses({
    ok: {
      description: "Deletes a documents type by ID.",
      type: PublicDocumentTypeResponseDto,
    },
    notFound: true,
  })
  @Delete(":id")
  async delete(
    @Param("id") id: string,
  ): Promise<PublicDocumentTypeResponseDto> {
    return await this.documentsTypesService.delete(id);
  }
}
