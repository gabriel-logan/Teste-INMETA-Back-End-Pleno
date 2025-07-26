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

  async deleteDocument(documentId: string | Types.ObjectId): Promise<Document> {
    const deletedDocument = await this.documentModel
      .findByIdAndDelete(documentId)
      .lean();

    if (!deletedDocument) {
      throw new NotFoundException(
        `Document with id ${documentId as string} not found`,
      );
    }

    return deletedDocument;
  }
}
