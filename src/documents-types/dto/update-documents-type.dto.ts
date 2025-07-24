import { PartialType } from "@nestjs/swagger";

import { CreateDocumentsTypeDto } from "./create-documents-type.dto";

export class UpdateDocumentsTypeDto extends PartialType(
  CreateDocumentsTypeDto,
) {}
