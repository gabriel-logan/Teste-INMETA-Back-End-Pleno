import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Types } from "mongoose";
import { Transactional } from "src/common/decorators/transaction/Transactional";
import { AuthPayload } from "src/common/types";
import { EnvGlobalConfig } from "src/configs/types";
import { EmployeeRole } from "src/employees/schemas/employee.schema";
import { v4 as uuidv4 } from "uuid";

import { SendOrDeleteDocumentFileResponseDto } from "../dto/response/send-or-delete-document-file.dto";
import { DocumentStatus } from "../schemas/document.schema";
import { DocumentsService } from "./documents.service";

@Injectable()
export class DocumentFilesService {
  private readonly logger = new Logger(DocumentFilesService.name);
  private readonly baseUrl: string;

  constructor(
    private readonly documentsService: DocumentsService,
    private readonly configService: ConfigService<EnvGlobalConfig, true>,
  ) {
    this.baseUrl =
      this.configService.get<EnvGlobalConfig["server"]>("server").baseUrl;
  }

  private generateDocumentUrl(mimeType: string | undefined): string {
    const parsedMimeType = mimeType?.split("/")[1] || "bin";

    const newFileName = uuidv4() + "." + parsedMimeType;

    return `${this.baseUrl}/files/${newFileName}`;
  }

  // DocumentFile is a placeholder for the actual file type
  // Replace it with the actual type used for document files
  @Transactional()
  async sendDocumentFile(
    documentId: Types.ObjectId,
    documentFile: Express.Multer.File,
    employee: AuthPayload,
  ): Promise<SendOrDeleteDocumentFileResponseDto> {
    const document = await this.documentsService.findById(documentId, {
      populates: ["employee"],
      lean: false,
    });

    // Check if the document is already sent
    if (document.documentUrl) {
      throw new BadRequestException(
        `Document with id ${documentId.toString()} has already been sent. If you want to resend it, please delete the existing document and create a new one.`,
      );
    }

    // if its the common employee that is trying to send a document file
    // Verify if the employee is the document owner
    // If not, throw a ForbiddenException
    if (employee.role === EmployeeRole.COMMON) {
      if (!document.employee._id.equals(employee.sub)) {
        throw new ForbiddenException(
          `Employee ${employee.username} is not the owner of document ${documentId.toString()}`,
        );
      }
    }

    const documentUrl = this.generateDocumentUrl(documentFile.mimetype);

    document.documentUrl = documentUrl;

    // Update document status to 'sent'
    document.status = DocumentStatus.AVAILABLE;

    await document.save();

    // Logic to send the document (e.g., via cloud storage)
    // This is a placeholder for the actual implementation
    this.logger.log(
      `Sending document file for employee ${document.employee.firstName}`,
    );
    // Implement the actual

    return {
      message: "Document file sent successfully",
      documentUrl,
    };
  }

  @Transactional()
  async deleteDocumentFile(
    documentId: Types.ObjectId,
  ): Promise<SendOrDeleteDocumentFileResponseDto> {
    const document = await this.documentsService.findById(documentId, {
      populates: ["employee"],
      lean: false,
    });

    if (!document.documentUrl) {
      throw new BadRequestException(
        `Document with id ${documentId.toString()} does not have a file to delete.`,
      );
    }

    const documentUrlBeforeDelete = document.documentUrl;

    document.documentUrl = null;
    document.status = DocumentStatus.MISSING;

    await document.save();

    // Logic to delete the document file (e.g., from cloud storage)
    this.logger.log(
      `Deleting document file for employee ${document.employee.firstName}`,
    );

    return {
      message: "Document file deleted successfully",
      documentUrl: documentUrlBeforeDelete,
    };
  }
}
