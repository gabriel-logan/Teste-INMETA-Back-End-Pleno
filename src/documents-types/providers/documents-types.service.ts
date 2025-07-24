import { Injectable } from "@nestjs/common";

import { CreateDocumentsTypeRequestDto } from "../dto/request/create-documents-type.dto";
import { UpdateDocumentsTypeRequestDto } from "../dto/request/update-documents-type.dto";

@Injectable()
export class DocumentsTypesService {
  async findAll() {
    return `This action returns all documentsTypes`;
  }

  async findById(id: string) {
    return `This action returns a #${id} documentsType`;
  }

  async create(createDocumentsTypeDto: CreateDocumentsTypeRequestDto) {
    return "This action adds a new documentsType";
  }

  async update(
    id: string,
    updateDocumentsTypeDto: UpdateDocumentsTypeRequestDto,
  ) {
    return `This action updates a #${id} documentsType`;
  }

  async delete(id: string) {
    return `This action removes a #${id} documentsType`;
  }
}
