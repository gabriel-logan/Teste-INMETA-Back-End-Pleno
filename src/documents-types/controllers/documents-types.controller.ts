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

import { CreateDocumentsTypeRequestDto } from "../dto/request/create-documents-type.dto";
import { UpdateDocumentsTypeRequestDto } from "../dto/request/update-documents-type.dto";
import { PublicDocumentsTypeResponseDto } from "../dto/response/public-documents-type.dto";
import { DocumentsTypesService } from "../providers/documents-types.service";

@ApiGlobalErrorResponses()
@Controller("documents-types")
export class DocumentsTypesController {
  constructor(private readonly documentsTypesService: DocumentsTypesService) {}

  @ApiStandardResponses({
    ok: {
      description: "Returns a list of all documents types.",
      type: PublicDocumentsTypeResponseDto,
      isArray: true,
    },
  })
  @Get()
  async findAll(): Promise<PublicDocumentsTypeResponseDto[]> {
    return await this.documentsTypesService.findAll();
  }

  @ApiStandardResponses({
    ok: {
      description: "Returns a specific documents type by ID.",
      type: PublicDocumentsTypeResponseDto,
    },
    notFound: true,
  })
  @Get(":id")
  async findById(
    @Param("id") id: string,
  ): Promise<PublicDocumentsTypeResponseDto> {
    return await this.documentsTypesService.findById(id);
  }

  @ApiStandardResponses({
    ok: {
      description: "Creates a new documents type.",
      type: PublicDocumentsTypeResponseDto,
      statusCode: HttpStatus.CREATED,
    },
    badRequest: true,
  })
  @Post()
  async create(
    @Body() createDocumentsTypeDto: CreateDocumentsTypeRequestDto,
  ): Promise<PublicDocumentsTypeResponseDto> {
    return await this.documentsTypesService.create(createDocumentsTypeDto);
  }

  @ApiStandardResponses({
    ok: {
      description: "Updates an existing documents type.",
      type: PublicDocumentsTypeResponseDto,
    },
    notFound: true,
    badRequest: true,
  })
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateDocumentsTypeDto: UpdateDocumentsTypeRequestDto,
  ): Promise<PublicDocumentsTypeResponseDto> {
    return await this.documentsTypesService.update(id, updateDocumentsTypeDto);
  }

  @ApiStandardResponses({
    ok: {
      description: "Deletes a documents type by ID.",
      type: PublicDocumentsTypeResponseDto,
    },
    notFound: true,
  })
  @Delete(":id")
  async delete(
    @Param("id") id: string,
  ): Promise<PublicDocumentsTypeResponseDto> {
    return await this.documentsTypesService.delete(id);
  }
}
