import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  Document,
  DocumentStatus,
} from "src/documents/schemas/document.schema";

@Injectable()
export class EmployeeDocumentService {
  constructor(
    @InjectModel(Document.name) private readonly documentModel: Model<Document>,
  ) {}

  async createDocument(
    employeeId: string | Types.ObjectId,
    documentTypeId: string | Types.ObjectId,
  ): Promise<Document> {
    const newDocument = new this.documentModel({
      documentType: documentTypeId,
      status: DocumentStatus.MISSING,
      employee: employeeId,
    });

    const savedDocument = await newDocument.save();

    return savedDocument;
  }

  async deleteDocumentByEmployeeIdAndDocumentTypeId(
    employeeId: string | Types.ObjectId,
    documentTypeId: string | Types.ObjectId,
  ): Promise<Document> {
    const document = await this.documentModel
      .findOneAndDelete({
        employee: employeeId,
        documentType: documentTypeId,
      })
      .lean();

    if (!document) {
      throw new NotFoundException(
        `Document with employeeId ${employeeId.toString()} and documentTypeId ${documentTypeId.toString()} not found`,
      );
    }

    // If needed DELETE the document file from storage here TOO

    return document;
  }
}
