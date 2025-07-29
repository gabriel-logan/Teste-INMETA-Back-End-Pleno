import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

import { isCpf } from "../decorators/validation/IsCpf";

@Injectable()
export class ParseCpfPipe implements PipeTransform<unknown, string> {
  private readonly optional: boolean;

  constructor({ optional = false }: { optional?: boolean } = {}) {
    this.optional = optional;
  }

  transform(value: unknown): string {
    if (this.optional && value === undefined) {
      return undefined as unknown as string;
    }

    if (isCpf(value)) {
      return (value as string).replace(/\D/g, "").trim(); // Remove non-numeric characters and trim whitespace
    }

    throw new BadRequestException("The provided value is not a valid CPF.");
  }
}
