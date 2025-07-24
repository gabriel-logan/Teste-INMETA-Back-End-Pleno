import { Injectable } from "@nestjs/common";

import { CreateDocumentsTypeDto } from "./dto/create-documents-type.dto";
import { UpdateDocumentsTypeDto } from "./dto/update-documents-type.dto";

@Injectable()
export class DocumentsTypesService {
  create(createDocumentsTypeDto: CreateDocumentsTypeDto) {
    return "This action adds a new documentsType";
  }

  findAll() {
    return `This action returns all documentsTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} documentsType`;
  }

  update(id: number, updateDocumentsTypeDto: UpdateDocumentsTypeDto) {
    return `This action updates a #${id} documentsType`;
  }

  remove(id: number) {
    return `This action removes a #${id} documentsType`;
  }
}
