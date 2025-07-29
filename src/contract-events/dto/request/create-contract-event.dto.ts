import { IsDate, IsEnum, MaxLength } from "class-validator";
import { validationConstraints } from "src/common/constants";
import { IsCpf } from "src/common/decorators/validation/IsCpf";
import { IsNotBlankString } from "src/common/decorators/validation/IsNotBlankString";
import { ContractEventType } from "src/contract-events/schemas/contract-event.schema";

export class CreateContractEventRequestDto {
  @IsEnum(ContractEventType)
  public type: ContractEventType;

  @IsDate()
  public date: Date;

  @MaxLength(validationConstraints.contractEvent.reason.maxLength)
  @IsNotBlankString()
  public reason: string;

  @MaxLength(validationConstraints.employee.fullName.maxLength)
  @IsNotBlankString()
  public employeeFullName: string;

  @IsCpf()
  public employeeCpf: string;
}
