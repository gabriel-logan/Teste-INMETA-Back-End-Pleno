import { PartialType } from "@nestjs/swagger";

import { CreateDocumentTypeRequestDto } from "./create-document-type.dto";

export class UpdateDocumentTypeRequestDto extends PartialType(
  CreateDocumentTypeRequestDto,
) {}
