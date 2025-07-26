import { PartialType } from "@nestjs/swagger";

import { CreateAuthRequestDto } from "./create-auth.dto";

export class UpdateAuthRequestDto extends PartialType(CreateAuthRequestDto) {}
