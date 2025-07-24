import type { Type } from "@nestjs/common";
import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from "@nestjs/swagger";

import { BadRequestExceptionDto } from "../../dto/exception/bad-request.dto";
import { NotFoundExceptionDto } from "../../dto/exception/not-found.dto";

export type typeOkResponse =
  | string
  | ((...args: any[]) => any)
  | Type<unknown>
  | [(...args: any[]) => any]
  | undefined;

export type ResponseOptions = {
  ok: {
    description: string;
    type: typeOkResponse;
  };
  badRequest?: boolean;
  notFound?: boolean;
};

export function ApiStandardResponses(
  options: ResponseOptions,
): MethodDecorator {
  const decorators = [];

  decorators.push(
    ApiOkResponse({
      description: options.ok.description,
      type: options.ok.type,
    }),
  );

  if (options.badRequest) {
    decorators.push(
      ApiBadRequestResponse({
        description: "Bad request",
        type: BadRequestExceptionDto,
      }),
    );
  }

  if (options.notFound) {
    decorators.push(
      ApiNotFoundResponse({
        description: "Not found",
        type: NotFoundExceptionDto,
      }),
    );
  }

  return applyDecorators(...decorators);
}
