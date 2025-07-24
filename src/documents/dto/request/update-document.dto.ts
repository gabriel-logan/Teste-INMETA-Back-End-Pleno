import { PartialType } from "@nestjs/swagger";

import { CreateDocumentRequestDto } from "./create-document.dto";

export class UpdateDocumentRequestDto extends PartialType(
  CreateDocumentRequestDto,
) {}
