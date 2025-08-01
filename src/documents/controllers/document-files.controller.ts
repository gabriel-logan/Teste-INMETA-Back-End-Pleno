import {
  Controller,
  Delete,
  Param,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiParam } from "@nestjs/swagger";
import { Types } from "mongoose";
import { fileValidation } from "src/common/constants";
import {
  ApiGlobalErrorResponses,
  ApiStandardResponses,
  ApiTypeFormData,
} from "src/common/decorators/routes/docs.decorator";
import { EmployeeFromReq } from "src/common/decorators/routes/employee.decorator";
import { Roles } from "src/common/decorators/routes/roles.decorator";
import { ParseObjectIdPipeLocal } from "src/common/pipes/parse-objectId-local.pipe";
import { AuthPayload } from "src/common/types";
import { EmployeeRole } from "src/employees/schemas/employee.schema";

import { SendOrDeleteDocumentFileResponseDto } from "../dto/response/send-or-delete-document-file.dto";
import { DocumentFilesService } from "../providers/document-files.service";

@ApiGlobalErrorResponses()
@Controller("document-files")
export class DocumentFilesController {
  constructor(private readonly documentFilesService: DocumentFilesService) {}

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
  @ApiTypeFormData({ description: "Document file to be sent" })
  @ApiParam({
    name: "documentId",
    description: "ID of the document",
    type: String,
    format: "ObjectId",
  })
  @Post(":documentId/send")
  @UseInterceptors(FileInterceptor("documentFile"))
  async sendDocumentFile(
    @Param("documentId", new ParseObjectIdPipeLocal())
    documentId: Types.ObjectId,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator(fileValidation.general.size)
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
    format: "ObjectId",
  })
  @Delete(":documentId/delete")
  async deleteDocumentFile(
    @Param("documentId", new ParseObjectIdPipeLocal())
    documentId: Types.ObjectId,
  ): Promise<SendOrDeleteDocumentFileResponseDto> {
    return await this.documentFilesService.deleteDocumentFile(documentId);
  }
}
