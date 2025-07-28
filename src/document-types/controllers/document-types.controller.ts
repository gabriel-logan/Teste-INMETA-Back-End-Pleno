import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseEnumPipe,
  Post,
  Put,
} from "@nestjs/common";
import { ApiSecurity } from "@nestjs/swagger";
import {
  ApiGlobalErrorResponses,
  ApiStandardResponses,
} from "src/common/decorators/routes/docs.decorator";
import { Roles } from "src/common/decorators/routes/roles.decorator";
import { ParseObjectIdPipeLocal } from "src/common/pipes/parse-objectId-local.pipe";
import { EmployeeRole } from "src/employees/schemas/employee.schema";

import { CreateDocumentTypeRequestDto } from "../dto/request/create-document-type.dto";
import { UpdateDocumentTypeRequestDto } from "../dto/request/update-document-type.dto";
import { PublicDocumentTypeResponseDto } from "../dto/response/public-document-type.dto";
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
  @Get("id/:documentTypeId")
  async findById(
    @Param("documentTypeId", new ParseObjectIdPipeLocal())
    documentTypeId: string,
  ): Promise<PublicDocumentTypeResponseDto> {
    return await this.documentTypesService.findById(documentTypeId);
  }

  @ApiStandardResponses({
    ok: {
      description: "Returns a specific document type by name.",
      type: PublicDocumentTypeResponseDto,
    },
    notFound: true,
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
  ): Promise<PublicDocumentTypeResponseDto> {
    return await this.documentTypesService.findOneByName(documentTypeName);
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
