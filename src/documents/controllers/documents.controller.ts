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

import { CreateDocumentRequestDto } from "../dto/request/create-document.dto";
import { UpdateDocumentRequestDto } from "../dto/request/update-document.dto";
import { PublicDocumentResponseDto } from "../dto/response/public-document.dto";
import { DocumentsService } from "../providers/documents.service";

@ApiGlobalErrorResponses()
@Controller("documents")
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @ApiStandardResponses({
    ok: {
      description: "Returns all documents",
      type: PublicDocumentResponseDto,
      isArray: true,
    },
  })
  @Get()
  async findAll(): Promise<PublicDocumentResponseDto[]> {
    return await this.documentsService.findAll();
  }

  @ApiStandardResponses({
    ok: {
      description: "Returns a document by ID",
      type: PublicDocumentResponseDto,
    },
    notFound: true,
  })
  @Get(":id")
  async findById(@Param("id") id: string): Promise<PublicDocumentResponseDto> {
    return await this.documentsService.findById(id);
  }

  @ApiStandardResponses({
    ok: {
      description: "Creates a new document",
      type: PublicDocumentResponseDto,
      statusCode: HttpStatus.CREATED,
    },
    badRequest: true,
  })
  @Post()
  async create(
    @Body() createDocumentDto: CreateDocumentRequestDto,
  ): Promise<PublicDocumentResponseDto> {
    return await this.documentsService.create(createDocumentDto);
  }

  @ApiStandardResponses({
    ok: {
      description: "Updates a document by ID",
      type: PublicDocumentResponseDto,
    },
    notFound: true,
    badRequest: true,
  })
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateDocumentDto: UpdateDocumentRequestDto,
  ): Promise<PublicDocumentResponseDto> {
    return await this.documentsService.update(id, updateDocumentDto);
  }

  @ApiStandardResponses({
    ok: {
      description: "Deletes a document by ID",
      type: PublicDocumentResponseDto,
    },
    notFound: true,
  })
  @Delete(":id")
  async delete(@Param("id") id: string): Promise<PublicDocumentResponseDto> {
    return await this.documentsService.delete(id);
  }
}
