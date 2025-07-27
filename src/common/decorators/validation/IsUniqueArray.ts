import type { ValidationOptions } from "class-validator";
import { buildMessage, ValidateBy } from "class-validator";

export const IS_UNIQUE_ARRAY = "isUniqueArray";

function isUniqueArray(value: unknown): boolean {
  if (!Array.isArray(value)) {
    return false;
  }

  const seen = new Set(
    value.map((v) => {
      if (typeof v !== "string") {
        return JSON.stringify(v);
      }
      return v.trim(); // Normalize by trimming whitespace
    }),
  );

  return seen.size === value.length;
}

export function IsUniqueArray(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_UNIQUE_ARRAY,
      validator: {
        validate: isUniqueArray,
        defaultMessage: buildMessage(
          (eachPrefix) =>
            eachPrefix + "$property must not contain duplicate values",
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
