import { PartialType } from "@nestjs/swagger";

import { CreateContractEventDto } from "./create-contract-event.dto";

export class UpdateContractEventDto extends PartialType(
  CreateContractEventDto,
) {}
