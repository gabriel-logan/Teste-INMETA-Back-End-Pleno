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
import { DocumentTypesService } from "../providers/document-types.service";

@ApiGlobalErrorResponses()
@Controller("document-types")
export class DocumentTypesController {
  constructor(private readonly documentTypesService: DocumentTypesService) {}

  @ApiStandardResponses({
    ok: {
      description: "Returns a list of all document types.",
      type: PublicDocumentTypeResponseDto,
      isArray: true,
    },
  })
  @Get()
  async findAll(): Promise<PublicDocumentTypeResponseDto[]> {
    return await this.documentTypesService.findAll();
  }

  @ApiStandardResponses({
    ok: {
      description: "Returns a specific document type by ID.",
      type: PublicDocumentTypeResponseDto,
    },
    notFound: true,
  })
  @Get(":id")
  async findById(
    @Param("id") id: string,
  ): Promise<PublicDocumentTypeResponseDto> {
    return await this.documentTypesService.findById(id);
  }

  @ApiStandardResponses({
    ok: {
      description: "Creates a new document type.",
      type: PublicDocumentTypeResponseDto,
      statusCode: HttpStatus.CREATED,
    },
    badRequest: true,
  })
  @Post()
  async create(
    @Body() createDocumentsTypeDto: CreateDocumentTypeRequestDto,
  ): Promise<PublicDocumentTypeResponseDto> {
    return await this.documentTypesService.create(createDocumentsTypeDto);
  }

  @ApiStandardResponses({
    ok: {
      description: "Updates an existing document type.",
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
    return await this.documentTypesService.update(id, updateDocumentsTypeDto);
  }

  @ApiStandardResponses({
    ok: {
      description: "Deletes a document type by ID.",
      type: PublicDocumentTypeResponseDto,
    },
    notFound: true,
  })
  @Delete(":id")
  async delete(
    @Param("id") id: string,
  ): Promise<PublicDocumentTypeResponseDto> {
    return await this.documentTypesService.delete(id);
  }
}
