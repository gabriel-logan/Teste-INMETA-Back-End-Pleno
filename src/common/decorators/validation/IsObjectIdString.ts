import type { ValidationOptions } from "class-validator";
import { buildMessage, ValidateBy } from "class-validator";
import { isValidObjectId } from "mongoose";

export const IS_OBJECT_ID_STRING = "isObjectIdString";

export function isObjectIdString(value: unknown): boolean {
  if (typeof value !== "string") {
    return false; // Ensure the value is a string
  }

  return isValidObjectId(value);
}

export function IsObjectIdString(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_OBJECT_ID_STRING,
      validator: {
        validate: (value) => isObjectIdString(value),
        defaultMessage: buildMessage(
          (eachPrefix) =>
            eachPrefix + "$property must be a valid string ObjectId format",
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
