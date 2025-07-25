import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiGlobalErrorResponses,
  ApiStandardResponses,
  ApiTypeFormData,
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
  @Get(":documentId")
  async findById(
    @Param("documentId", ParseObjectIdPipe) documentId: string,
  ): Promise<PublicDocumentResponseDto> {
    return await this.documentsService.findById(documentId);
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
  @Patch(":documentId")
  async update(
    @Param("documentId", ParseObjectIdPipe) documentId: string,
    @Body() updateDocumentDto: UpdateDocumentRequestDto,
  ): Promise<PublicDocumentResponseDto> {
    return await this.documentsService.update(documentId, updateDocumentDto);
  }

  @ApiStandardResponses({
    ok: {
      description: "Deletes a document by ID",
      type: void 0,
    },
    notFound: true,
  })
  @Delete(":documentId")
  async delete(
    @Param("documentId", ParseObjectIdPipe) documentId: string,
  ): Promise<void> {
    return await this.documentsService.delete(documentId);
  }

  @ApiStandardResponses({
    ok: {
      description: "Sends a document file",
      type: void 0,
    },
    notFound: true,
    badRequest: true,
  })
  @ApiTypeFormData()
  @Post(":documentId/send-file")
  @UseInterceptors(FileInterceptor("documentFile"))
  async sendFile(
    @Param("documentId", ParseObjectIdPipe) documentId: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024, // 5 MB
          message(maxSize) {
            return `File size should not exceed ${maxSize / 1024 / 1024} MB`;
          },
        })
        .build(),
    )
    documentFile: Express.Multer.File,
  ): Promise<void> {
    return await this.documentsService.sendDocumentFile(
      documentId,
      documentFile,
    );
  }
}
