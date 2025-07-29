import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Post,
  Put,
} from "@nestjs/common";
import { ApiParam, ApiSecurity } from "@nestjs/swagger";
import { Types } from "mongoose";
import {
  ApiGlobalErrorResponses,
  ApiStandardResponses,
} from "src/common/decorators/routes/docs.decorator";
import { Roles } from "src/common/decorators/routes/roles.decorator";
import { DocumentTypeResponseDto } from "src/common/dto/response/document-type.dto";
import { ParseObjectIdPipeLocal } from "src/common/pipes/parse-objectId-local.pipe";
import { EmployeeRole } from "src/employees/schemas/employee.schema";

import { CreateDocumentTypeRequestDto } from "../dto/request/create-document-type.dto";
import { UpdateDocumentTypeRequestDto } from "../dto/request/update-document-type.dto";
import { DocumentTypesService } from "../providers/document-types.service";
import { DocumentTypeAllowedValues } from "../schemas/document-type.schema";

@ApiSecurity("bearer")
@Roles(EmployeeRole.MANAGER, EmployeeRole.ADMIN)
@ApiGlobalErrorResponses()
@Controller("document-types")
export class DocumentTypesController {
  constructor(private readonly documentTypesService: DocumentTypesService) {}

  @ApiStandardResponses({
    ok: {
      description: "Returns a list of all document types.",
      type: DocumentTypeResponseDto,
      isArray: true,
    },
  })
  @Get()
  async findAll(): Promise<DocumentTypeResponseDto[]> {
    return await this.documentTypesService.findAll();
  }

  @ApiStandardResponses({
    ok: {
      description: "Returns a specific document type by ID.",
      type: DocumentTypeResponseDto,
    },
    notFound: true,
  })
  @Get("id/:documentTypeId")
  async findById(
    @Param("documentTypeId", new ParseObjectIdPipeLocal())
    documentTypeId: Types.ObjectId,
  ): Promise<DocumentTypeResponseDto> {
    return await this.documentTypesService.findById(documentTypeId);
  }

  @ApiStandardResponses({
    ok: {
      description: "Returns a specific document type by name.",
      type: DocumentTypeResponseDto,
    },
    notFound: true,
  })
  @ApiParam({
    name: "documentTypeName",
    enum: DocumentTypeAllowedValues,
    description: "The name of the document type to retrieve.",
  })
  @Get("name/:documentTypeName")
  async findOneByName(
    @Param(
      "documentTypeName",
      new ParseEnumPipe(DocumentTypeAllowedValues, {
        exceptionFactory: (): void => {
          throw new BadRequestException(
            "Invalid document type name. Allowed values are: " +
              Object.values(DocumentTypeAllowedValues).join(", "),
          );
        },
      }),
    )
    documentTypeName: string,
  ): Promise<DocumentTypeResponseDto> {
    return await this.documentTypesService.findOneByName(documentTypeName);
  }

  @ApiStandardResponses({
    ok: {
      description: "Creates a new document type.",
      type: DocumentTypeResponseDto,
      isStatusCodeCreated: true,
    },
    badRequest: true,
  })
  @Post()
  async create(
    @Body() createDocumentsTypeDto: CreateDocumentTypeRequestDto,
  ): Promise<DocumentTypeResponseDto> {
    return await this.documentTypesService.create(createDocumentsTypeDto);
  }

  @ApiStandardResponses({
    ok: {
      description: "Updates an existing document type.",
      type: DocumentTypeResponseDto,
    },
    notFound: true,
    badRequest: true,
  })
  @Put(":documentTypeId")
  async update(
    @Param("documentTypeId", new ParseObjectIdPipeLocal())
    documentTypeId: Types.ObjectId,
    @Body() updateDocumentsTypeDto: UpdateDocumentTypeRequestDto,
  ): Promise<DocumentTypeResponseDto> {
    return await this.documentTypesService.update(
      documentTypeId,
      updateDocumentsTypeDto,
    );
  }
}
