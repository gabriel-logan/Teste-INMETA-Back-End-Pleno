import { BadRequestException, Injectable } from "@nestjs/common";

import { Transactional } from "./common/decorators/transaction/Transactional";

@Injectable()
export class AppService {
  @Transactional()
  getTemporary(param: number): any {
    if (param > 2) {
      throw new BadRequestException(
        "This endpoint is temporary and only accepts param values less than or equal to 2.",
      );
    }

    return {
      message: "Temporary endpoint response",
      paramValue: param,
    };
  }
}
