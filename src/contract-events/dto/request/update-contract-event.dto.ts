import { IsDate, IsEnum } from "class-validator";
import { IsCpf } from "src/common/decorators/validation/IsCpf";
import { IsNotBlankString } from "src/common/decorators/validation/IsNotBlankString";
import { ContractEventType } from "src/contract-events/schemas/contract-event.schema";

export class UpdateContractEventRequestDto {
  @IsEnum(ContractEventType)
  public type: ContractEventType;

  @IsDate()
  public date: Date;

  @IsNotBlankString()
  public reason: string;

  @IsNotBlankString()
  public employeeFullName: string;

  @IsCpf()
  public employeeCpf: string;
}
