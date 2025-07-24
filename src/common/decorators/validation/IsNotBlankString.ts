import type { ValidationOptions } from "class-validator";
import { buildMessage, ValidateBy } from "class-validator";

export const IS_NOT_BLANK_STRING = "isNotBlankString";

export function isNotBlankString(value: unknown): boolean {
  if (typeof value !== "string") {
    return false; // Ensure the value is a string
  }

  return value.trim().length > 0;
}

export function IsNotBlankString(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_NOT_BLANK_STRING,
      validator: {
        validate: (value) => isNotBlankString(value),
        defaultMessage: buildMessage(
          (eachPrefix) => eachPrefix + "$property should be a non-blank string",
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
