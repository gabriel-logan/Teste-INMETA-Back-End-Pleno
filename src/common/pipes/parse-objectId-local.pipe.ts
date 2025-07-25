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
      throw new BadRequestException(
        `Invalid ObjectId: '${JSON.stringify(value)}' is not a valid MongoDB ObjectId`,
      );
    }

    return new Types.ObjectId(value);
  }
}
