import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from "@nestjs/common";
import { ApiParam, ApiQuery, ApiSecurity } from "@nestjs/swagger";
import { Types } from "mongoose";
import {
  ApiGetAllMissingDocumentsQueries,
  ApiGlobalErrorResponses,
  ApiStandardResponses,
} from "src/common/decorators/routes/docs.decorator";
import { Roles } from "src/common/decorators/routes/roles.decorator";
import { DocumentFullResponseDto } from "src/common/dto/response/document.dto";
import { ParseObjectIdPipeLocal } from "src/common/pipes/parse-objectId-local.pipe";
import { EmployeeRole } from "src/employees/schemas/employee.schema";

import { UpdateDocumentRequestDto } from "../dto/request/update-document.dto";
import { GetDocumentStatusesByEmployeeIdResponseDto } from "../dto/response/get-document-statuses-by-employeeId.dto";
import { DocumentsService } from "../providers/documents.service";
import { DocumentStatus } from "../schemas/document.schema";

@ApiSecurity("bearer")
@ApiGlobalErrorResponses()
@Roles(EmployeeRole.MANAGER, EmployeeRole.ADMIN)
@Controller("documents")
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

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
