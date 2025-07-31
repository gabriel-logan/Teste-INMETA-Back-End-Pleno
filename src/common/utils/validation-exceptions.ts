import { BadRequestException } from "@nestjs/common";
import { DocumentTypeAllowedValues } from "src/document-types/schemas/document-type.schema";

export function throwInvalidDocumentTypeName(): never {
  throw new BadRequestException(
    "Invalid document type name. Allowed values are: " +
      Object.values(DocumentTypeAllowedValues).join(", "),
  );
}
