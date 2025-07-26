import { IsDate, IsEnum } from "class-validator";
import { IsNotBlankString } from "src/common/decorators/validation/IsNotBlankString";
import { ContractEventType } from "src/contract-events/schemas/contract-event.schema";

export class CreateContractEventRequestDto {
  @IsEnum(ContractEventType)
  public type: ContractEventType;

  @IsDate()
  public date: Date;

  @IsNotBlankString()
  public reason: string;
}
