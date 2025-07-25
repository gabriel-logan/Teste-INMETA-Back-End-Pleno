import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiQuery } from "@nestjs/swagger";
import {
  ApiGetAllMissingDocumentsQueries,
  ApiGlobalErrorResponses,
  ApiStandardResponses,
  ApiTypeFormData,
} from "src/common/decorators/routes/docs";
import { ParseObjectIdPipeLocal } from "src/common/pipes/parse-objectId-local.pipe";

import { CreateDocumentRequestDto } from "../dto/request/create-document.dto";
import { UpdateDocumentRequestDto } from "../dto/request/update-document.dto";
import { PublicDocumentResponseDto } from "../dto/response/public-document.dto";
import { SendDeleteDocumentFileResponseDto } from "../dto/response/send-delete-document-file.dto";
import { DocumentsService } from "../providers/documents.service";
import { DocumentStatus } from "../schemas/document.schema";

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
    @Param("documentId", new ParseObjectIdPipeLocal()) documentId: string,
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
    @Param("documentId", new ParseObjectIdPipeLocal()) documentId: string,
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
    @Param("documentId", new ParseObjectIdPipeLocal()) documentId: string,
  ): Promise<void> {
    return await this.documentsService.delete(documentId);
  }

  @ApiStandardResponses({
    ok: {
      description: "Sends a document file",
      type: SendDeleteDocumentFileResponseDto,
      statusCode: HttpStatus.CREATED,
    },
    notFound: true,
    badRequest: true,
  })
  @ApiTypeFormData()
  @Post(":documentId/send-file")
  @UseInterceptors(FileInterceptor("documentFile"))
  async sendDocumentFile(
    @Param("documentId", new ParseObjectIdPipeLocal()) documentId: string,
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
  ): Promise<SendDeleteDocumentFileResponseDto> {
    return await this.documentsService.sendDocumentFile(
      documentId,
      documentFile,
    );
  }

  @ApiStandardResponses({
    ok: {
      description: "Deletes a document file",
      type: SendDeleteDocumentFileResponseDto,
    },
    notFound: true,
    badRequest: true,
  })
  @Delete(":documentId/delete-file")
  async deleteDocumentFile(
    @Param("documentId", new ParseObjectIdPipeLocal()) documentId: string,
  ): Promise<SendDeleteDocumentFileResponseDto> {
    return await this.documentsService.deleteDocumentFile(documentId);
  }

  @ApiStandardResponses({
    ok: {
      description: "Returns document statuses by employee ID",
      type: Object,
    },
    notFound: true,
  })
  @ApiQuery({ required: false, name: "status", enum: DocumentStatus })
  @Get("employee/:employeeId/statuses")
  async getDocumentStatusesByEmployeeId(
    @Param("employeeId", new ParseObjectIdPipeLocal()) employeeId: string,
    @Query("status") status?: DocumentStatus,
  ): Promise<
    Record<
      string,
      {
        documentId: string;
        status: DocumentStatus;
      }
    >
  > {
    return await this.documentsService.getDocumentStatusesByEmployeeId(
      employeeId,
      status,
    );
  }

  @ApiStandardResponses({
    ok: {
      description: "Returns all missing documents",
      type: PublicDocumentResponseDto,
      isArray: true,
    },
  })
  @Get("missing/all")
  @ApiGetAllMissingDocumentsQueries()
  async getAllMissingDocuments(
    @Query("page", new ParseIntPipe({ optional: true })) page: number = 1,
    @Query("limit", new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query("employeeId", new ParseObjectIdPipeLocal({ optional: true }))
    employeeId?: string,
    @Query("documentTypeId", new ParseObjectIdPipeLocal({ optional: true }))
    documentTypeId?: string,
  ): Promise<{
    documents: PublicDocumentResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    return await this.documentsService.getAllMissingDocuments(
      page,
      limit,
      employeeId,
      documentTypeId,
    );
  }
}
