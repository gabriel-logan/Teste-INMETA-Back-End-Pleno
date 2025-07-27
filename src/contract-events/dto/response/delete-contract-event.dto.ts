import type { Types } from "mongoose";

export class DeleteContractEventResponseDto {
  public readonly id: Types.ObjectId;
  public readonly message: string;
}
