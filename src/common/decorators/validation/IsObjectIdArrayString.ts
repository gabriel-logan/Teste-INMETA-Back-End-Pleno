import type { ValidationOptions } from "class-validator";
import { buildMessage, ValidateBy } from "class-validator";
import { isValidObjectId } from "mongoose";

export const IS_OBJECT_ID_ARRAY_STRING = "isObjectIdArrayString";

export function isObjectIdArrayString(value: unknown): boolean {
  if (!Array.isArray(value)) {
    return false; // Ensure the value is an array
  }

  return value.every((item) => isValidObjectId(item));
}

export function IsObjectIdArrayString(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_OBJECT_ID_ARRAY_STRING,
      validator: {
        validate: (value) => isObjectIdArrayString(value),
        defaultMessage: buildMessage(
          (eachPrefix) =>
            eachPrefix +
            "$property must be a valid array of string ObjectId format",
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
