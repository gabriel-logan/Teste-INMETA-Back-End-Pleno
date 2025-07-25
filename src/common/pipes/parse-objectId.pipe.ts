import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ObjectId } from "mongodb";
import type { Types } from "mongoose";

@Injectable()
export class ParseObjectIdPipe
  implements PipeTransform<unknown, Types.ObjectId | undefined>
{
  private readonly required: boolean;

  constructor({ required = true }: { required?: boolean } = {}) {
    this.required = required;
  }

  transform(value: unknown): Types.ObjectId | undefined {
    if (!this.required && value == undefined) {
      return undefined;
    }

    const stringValue = String(value);

    const valueValidated = this.validateObjectId(stringValue);

    if (!valueValidated) {
      throw new BadRequestException("Invalid ObjectId format");
    }

    return new ObjectId(stringValue);
  }

  private validateObjectId(value: string): boolean {
    return ObjectId.isValid(value);
  }
}
