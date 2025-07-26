import { PartialType } from "@nestjs/swagger";

import { CreateContractEventRequestDto } from "./create-contract-event.dto";

export class UpdateContractEventRequestDto extends PartialType(
  CreateContractEventRequestDto,
) {}
