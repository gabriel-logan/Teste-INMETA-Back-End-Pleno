import type { ValidationOptions } from "class-validator";
import { buildMessage, ValidateBy } from "class-validator";
import { cpfIsValid } from "multiform-validator";

export const IS_CPF = "isCpf";

export function isCpf(value: unknown): boolean {
  if (typeof value !== "string" && typeof value !== "number") {
    return false; // Ensure the value is a string or number
  }

  return cpfIsValid(value.toString()).isValid;
}

export function IsCpf(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_CPF,
      validator: {
        validate: (value) => isCpf(value),
        defaultMessage: buildMessage(
          (eachPrefix) => eachPrefix + "$property must be a valid CPF",
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
