import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Injectable()
export class ParseObjectIdPipeLocal
  extends ParseObjectIdPipe
  implements PipeTransform<unknown, Types.ObjectId>
{
  private readonly optional: boolean;

  constructor({ optional = false }: { optional?: boolean } = {}) {
    super();
    this.optional = optional;
  }

  transform(value: unknown): Types.ObjectId {
    if (this.optional && value === undefined) {
      return undefined as unknown as Types.ObjectId;
    }

    if (typeof value !== "string" || !Types.ObjectId.isValid(value)) {
      throw new BadRequestException(this.generateErrorMessage(value));
    }

    return new Types.ObjectId(value);
  }

  private generateErrorMessage(value: unknown): string {
    const valueString =
      typeof value === "string" ? value : JSON.stringify(value);

    return `Invalid ObjectId: '${valueString}' is not a valid MongoDB ObjectId`;
  }
}
