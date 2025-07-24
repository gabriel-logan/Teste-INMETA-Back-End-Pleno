import type { ValidationOptions } from "class-validator";
import { buildMessage, ValidateBy } from "class-validator";

export const IS_OBJECT_ID_STRING = "isObjectIdString";

export function isObjectIdString(value: unknown): boolean {
  if (typeof value !== "string") {
    return false; // Ensure the value is a string
  }

  // Regular expression to validate MongoDB ObjectId format
  const objectIdRegex = /^[a-fA-F0-9]{24}$/;

  return objectIdRegex.test(value);
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
