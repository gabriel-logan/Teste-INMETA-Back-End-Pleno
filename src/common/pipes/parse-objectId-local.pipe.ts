import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Injectable()
export class ParseObjectIdPipeLocal
  implements PipeTransform<unknown, Types.ObjectId>
{
  private readonly optional: boolean;

  constructor({ optional = false }: { optional?: boolean } = {}) {
    this.optional = optional;
  }

  transform(value: unknown, metadata: ArgumentMetadata): Types.ObjectId {
    if (this.optional && value === undefined) {
      return undefined as unknown as Types.ObjectId;
    }

    if (typeof value !== "string") {
      throw new BadRequestException(
        `Expected a string for ObjectId in ${metadata.type} '${metadata.data}'.`,
      );
    }

    return new ParseObjectIdPipe().transform(value);
  }
}
