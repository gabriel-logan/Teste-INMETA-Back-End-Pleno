import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";
import { ApiParam, ApiSecurity } from "@nestjs/swagger";
import { Types } from "mongoose";
import {
  ApiGlobalErrorResponses,
  ApiStandardResponses,
} from "src/common/decorators/routes/docs.decorator";
import { Roles } from "src/common/decorators/routes/roles.decorator";
import { ParseObjectIdPipeLocal } from "src/common/pipes/parse-objectId-local.pipe";

import { LinkDocumentTypesRequestDto } from "../dto/request/link-document-types.dto";
import { DocumentTypeEmployeeLinkedResponseDto } from "../dto/response/documentType-employee-linked.dto";
import { DocumentTypeEmployeeUnlinkedResponseDto } from "../dto/response/documentType-employee-unlinked.dto";
import { DocumentTypeLinkersService } from "../providers/document-type-linkers.service";
import { EmployeeRole } from "../schemas/employee.schema";

@ApiSecurity("bearer")
@ApiGlobalErrorResponses()
@Roles(EmployeeRole.MANAGER, EmployeeRole.ADMIN)
@Controller("document-type-linkers")
export class DocumentTypeLinkersController {
  constructor(
    private readonly documentTypeLinkersService: DocumentTypeLinkersService,
  ) {}

  @ApiStandardResponses({
    ok: {
      description: "Link document types to an employee",
      type: DocumentTypeEmployeeLinkedResponseDto,
    },
    notFound: true,
    badRequest: true,
  })
  @ApiParam({
    name: "employeeId",
    description: "ID of the employee",
    type: String,
    format: "ObjectId",
  })
  @HttpCode(HttpStatus.OK)
  @Post(":employeeId/link")
  async linkDocumentTypes(
    @Param("employeeId", new ParseObjectIdPipeLocal())
    employeeId: Types.ObjectId,
    @Body() linkDocumentTypesDto: LinkDocumentTypesRequestDto,
  ): Promise<DocumentTypeEmployeeLinkedResponseDto> {
    return await this.documentTypeLinkersService.linkDocumentTypes(
      employeeId,
      linkDocumentTypesDto,
    );
  }

  @ApiStandardResponses({
    ok: {
      description: "Unlink document types from an employee",
      type: DocumentTypeEmployeeUnlinkedResponseDto,
    },
    notFound: true,
    badRequest: true,
  })
  @ApiParam({
    name: "employeeId",
    description: "ID of the employee",
    type: String,
    format: "ObjectId",
  })
  @HttpCode(HttpStatus.OK)
  @Post(":employeeId/unlink")
  async unlinkDocumentTypes(
    @Param("employeeId", new ParseObjectIdPipeLocal())
    employeeId: Types.ObjectId,
    @Body() unlinkDocumentTypesDto: LinkDocumentTypesRequestDto,
  ): Promise<DocumentTypeEmployeeUnlinkedResponseDto> {
    return await this.documentTypeLinkersService.unlinkDocumentTypes(
      employeeId,
      unlinkDocumentTypesDto,
    );
  }
}
