import type { Types } from "mongoose";

export class DeleteContractEventResponseDto {
  public id: Types.ObjectId;
  public message: string;
}
