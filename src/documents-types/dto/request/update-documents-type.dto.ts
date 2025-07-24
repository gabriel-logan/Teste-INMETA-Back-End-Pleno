import { PartialType } from "@nestjs/swagger";

import { CreateDocumentsTypeRequestDto } from "./create-documents-type.dto";

export class UpdateDocumentsTypeRequestDto extends PartialType(
  CreateDocumentsTypeRequestDto,
) {}
