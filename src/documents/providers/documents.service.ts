import { Injectable } from "@nestjs/common";

import { CreateDocumentRequestDto } from "../dto/request/create-document.dto";
import { UpdateDocumentRequestDto } from "../dto/request/update-document.dto";

@Injectable()
export class DocumentsService {
  create(createDocumentDto: CreateDocumentRequestDto) {
    return "This action adds a new document";
  }

  findAll() {
    return `This action returns all documents`;
  }

  findOne(id: string) {
    return `This action returns a #${id} document`;
  }

  update(id: string, updateDocumentDto: UpdateDocumentRequestDto) {
    return `This action updates a #${id} document`;
  }

  delete(id: string) {
    return `This action deletes a #${id} document`;
  }
}
