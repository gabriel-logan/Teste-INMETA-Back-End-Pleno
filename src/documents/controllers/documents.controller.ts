import {
  Body,
  Controller,
  Delete,
  Get,
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
import { ApiParam, ApiQuery, ApiSecurity } from "@nestjs/swagger";
import { Types } from "mongoose";
import { fileValidation } from "src/common/constants";
import {
  ApiGetAllMissingDocumentsQueries,
  ApiGlobalErrorResponses,
  ApiStandardResponses,
  ApiTypeFormData,
} from "src/common/decorators/routes/docs.decorator";
import { EmployeeFromReq } from "src/common/decorators/routes/employee.decorator";
import { Roles } from "src/common/decorators/routes/roles.decorator";
import { DocumentFullResponseDto } from "src/common/dto/response/document.dto";
import { ParseObjectIdPipeLocal } from "src/common/pipes/parse-objectId-local.pipe";
import { AuthPayload } from "src/common/types";
import { EmployeeRole } from "src/employees/schemas/employee.schema";

import { UpdateDocumentRequestDto } from "../dto/request/update-document.dto";
import { GetDocumentStatusesByEmployeeIdResponseDto } from "../dto/response/get-document-statuses-by-employeeId.dto";
import { SendOrDeleteDocumentFileResponseDto } from "../dto/response/send-or-delete-document-file.dto";
import { DocumentFilesService } from "../providers/document-files.service";
import { DocumentsService } from "../providers/documents.service";
import { DocumentStatus } from "../schemas/document.schema";

@ApiSecurity("bearer")
@ApiGlobalErrorResponses()
@Controller("documents")
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly documentFilesService: DocumentFilesService,
  ) {}

  @Roles(EmployeeRole.MANAGER, EmployeeRole.ADMIN)
  @ApiStandardResponses({
    ok: {
      description: "Returns all documents",
      type: DocumentFullResponseDto,
      isArray: true,
    },
  })
  @Get()
  async findAllWithDocumentTypeAndEmployee(): Promise<
    DocumentFullResponseDto[]
  > {
    return await this.documentsService.findAllWithDocumentTypeAndEmployee();
  }

  @Roles(EmployeeRole.MANAGER, EmployeeRole.ADMIN)
  @ApiStandardResponses({
    ok: {
      description: "Returns a document by ID",
      type: DocumentFullResponseDto,
    },
    notFound: true,
  })
  @ApiParam({
    name: "documentId",
    description: "ID of the document",
    type: String,
  })
  @Get(":documentId")
  async findByIdWithDocumentTypeAndEmployee(
    @Param("documentId", new ParseObjectIdPipeLocal())
    documentId: Types.ObjectId,
  ): Promise<DocumentFullResponseDto> {
    return await this.documentsService.findByIdWithDocumentTypeAndEmployee(
      documentId,
    );
  }

  @Roles(EmployeeRole.MANAGER, EmployeeRole.ADMIN)
  @ApiStandardResponses({
    ok: {
      description: "Updates a document by ID",
      type: DocumentFullResponseDto,
    },
    notFound: true,
    badRequest: true,
  })
  @ApiParam({
    name: "documentId",
    description: "ID of the document",
    type: String,
  })
  @Patch(":documentId")
  async update(
    @Param("documentId", new ParseObjectIdPipeLocal())
    documentId: Types.ObjectId,
    @Body() updateDocumentDto: UpdateDocumentRequestDto,
  ): Promise<DocumentFullResponseDto> {
    return await this.documentsService.update(documentId, updateDocumentDto);
  }

  @Roles(EmployeeRole.MANAGER, EmployeeRole.ADMIN, EmployeeRole.COMMON)
  @ApiStandardResponses({
    ok: {
      description: "Sends a document file",
      type: SendOrDeleteDocumentFileResponseDto,
      isStatusCodeCreated: true,
    },
    notFound: true,
    badRequest: true,
  })
  @ApiTypeFormData()
  @ApiParam({
    name: "documentId",
    description: "ID of the document",
    type: String,
  })
  @Post(":documentId/file/send")
  @UseInterceptors(FileInterceptor("documentFile"))
  async sendDocumentFile(
    @Param("documentId", new ParseObjectIdPipeLocal())
    documentId: Types.ObjectId,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: fileValidation.general.size.maxSize,
          message(maxSize) {
            return fileValidation.general.size.message(maxSize);
          },
        })
        .build(),
    )
    documentFile: Express.Multer.File,
    @EmployeeFromReq() employee: AuthPayload,
  ): Promise<SendOrDeleteDocumentFileResponseDto> {
    return await this.documentFilesService.sendDocumentFile(
      documentId,
      documentFile,
      employee,
    );
  }

  @Roles(EmployeeRole.MANAGER, EmployeeRole.ADMIN)
  @ApiStandardResponses({
    ok: {
      description: "Deletes a document file",
      type: SendOrDeleteDocumentFileResponseDto,
    },
    notFound: true,
    badRequest: true,
  })
  @ApiParam({
    name: "documentId",
    description: "ID of the document",
    type: String,
  })
  @Delete(":documentId/file/delete")
  async deleteDocumentFile(
    @Param("documentId", new ParseObjectIdPipeLocal())
    documentId: Types.ObjectId,
  ): Promise<SendOrDeleteDocumentFileResponseDto> {
    return await this.documentFilesService.deleteDocumentFile(documentId);
  }

  @Roles(EmployeeRole.MANAGER, EmployeeRole.ADMIN)
  @ApiStandardResponses({
    ok: {
      description: "Returns document statuses by employee ID",
      type: GetDocumentStatusesByEmployeeIdResponseDto,
    },
    notFound: true,
  })
  @ApiParam({
    name: "employeeId",
    description: "ID of the employee",
    type: String,
  })
  @ApiQuery({ required: false, name: "status", enum: DocumentStatus })
  @Get("employee/:employeeId/statuses")
  async getDocumentStatusesByEmployeeId(
    @Param("employeeId", new ParseObjectIdPipeLocal())
    employeeId: Types.ObjectId,
    @Query("status") status?: DocumentStatus,
  ): Promise<GetDocumentStatusesByEmployeeIdResponseDto> {
    return await this.documentsService.getDocumentStatusesByEmployeeId(
      employeeId,
      status,
    );
  }

  @Roles(EmployeeRole.MANAGER, EmployeeRole.ADMIN)
  @ApiStandardResponses({
    ok: {
      description: "Returns all missing documents",
      type: DocumentFullResponseDto,
      isArray: true,
    },
  })
  @Get("missing/all")
  @ApiGetAllMissingDocumentsQueries()
  async getAllMissingDocuments(
    @Query("page", new ParseIntPipe({ optional: true })) page: number = 1,
    @Query("limit", new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query("employeeId", new ParseObjectIdPipeLocal({ optional: true }))
    employeeId?: Types.ObjectId,
    @Query("documentTypeId", new ParseObjectIdPipeLocal({ optional: true }))
    documentTypeId?: Types.ObjectId,
  ): Promise<{
    documents: DocumentFullResponseDto[];
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
