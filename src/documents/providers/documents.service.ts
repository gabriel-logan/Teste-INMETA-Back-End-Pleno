import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { CreateDocumentRequestDto } from "../dto/request/create-document.dto";
import { UpdateDocumentRequestDto } from "../dto/request/update-document.dto";
import { Document } from "../schemas/document.schema";

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document.name) private readonly documentModel: Model<Document>,
  ) {}

  async create(createDocumentDto: CreateDocumentRequestDto) {
    return "This action adds a new document";
  }

  async findAll() {
    return `This action returns all documents`;
  }

  async findOne(id: string) {
    return `This action returns a #${id} document`;
  }

  async update(id: string, updateDocumentDto: UpdateDocumentRequestDto) {
    return `This action updates a #${id} document`;
  }

  async delete(id: string) {
    return `This action deletes a #${id} document`;
  }
}
