import type { Type } from "@nestjs/common";
import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from "@nestjs/swagger";
import { InternalServerErrorDto } from "src/common/dto/exception/internal-server-error.dto";

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
): MethodDecorator & ClassDecorator {
  const decorators = [
    ApiOkResponse({
      description: options.ok.description,
      type: options.ok.type,
    }),
  ];

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

export function ApiInternalServerResponse(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiInternalServerErrorResponse({
      description: "Internal server error",
      type: InternalServerErrorDto,
    }),
  );
}
