import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import {
  ApiGlobalErrorResponses,
  ApiStandardResponses,
} from "src/common/decorators/routes/docs";
import { ParseObjectIdPipeLocal } from "src/common/pipes/parse-objectId-local.pipe";

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
  @Get(":documentTypeId")
  async findById(
    @Param("documentTypeId", new ParseObjectIdPipeLocal())
    documentTypeId: string,
  ): Promise<PublicDocumentTypeResponseDto> {
    return await this.documentTypesService.findById(documentTypeId);
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
  @Put(":documentTypeId")
  async update(
    @Param("documentTypeId", new ParseObjectIdPipeLocal())
    documentTypeId: string,
    @Body() updateDocumentsTypeDto: UpdateDocumentTypeRequestDto,
  ): Promise<PublicDocumentTypeResponseDto> {
    return await this.documentTypesService.update(
      documentTypeId,
      updateDocumentsTypeDto,
    );
  }
}
