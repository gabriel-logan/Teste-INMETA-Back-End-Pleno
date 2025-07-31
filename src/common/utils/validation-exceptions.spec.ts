import { BadRequestException } from "@nestjs/common";
import { DocumentTypeAllowedValues } from "src/document-types/schemas/document-type.schema";

import { throwInvalidDocumentTypeName } from "./validation-exceptions";

describe("Validation Exceptions", () => {
  describe("throwInvalidDocumentTypeName", () => {
    it("should throw BadRequestException", () => {
      expect(() => throwInvalidDocumentTypeName()).toThrow(BadRequestException);
    });

    it("should throw with the correct error message", () => {
      const expectedMessage =
        "Invalid document type name. Allowed values are: " +
        Object.values(DocumentTypeAllowedValues).join(", ");

      try {
        throwInvalidDocumentTypeName();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(error.message).toBe(expectedMessage);
      }
    });
  });
});
