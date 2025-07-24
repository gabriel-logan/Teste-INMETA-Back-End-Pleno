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

export function ApiOkAndNotFoundResponse({
  descriptionOkResponse,
  typeOkResponse,
}: {
  descriptionOkResponse: string;
  typeOkResponse: typeOkResponse;
}): MethodDecorator {
  return applyDecorators(
    ApiOkResponse({
      description: descriptionOkResponse,
      type: typeOkResponse,
    }),
    ApiNotFoundResponse({
      description: "Not found",
      type: NotFoundExceptionDto,
    }),
  );
}

export function ApiOkAndBadRequestResponse({
  descriptionOkResponse,
  typeOkResponse,
}: {
  typeOkResponse: typeOkResponse;
  descriptionOkResponse: string;
}): MethodDecorator {
  return applyDecorators(
    ApiOkResponse({
      description: descriptionOkResponse,
      type: typeOkResponse,
    }),
    ApiBadRequestResponse({
      description: "Bad request",
      type: BadRequestExceptionDto,
    }),
  );
}

export function ApiOkAndBadRequestAndNotFoundResponse({
  descriptionOkResponse,
  typeOkResponse,
}: {
  typeOkResponse: typeOkResponse;
  descriptionOkResponse: string;
}): MethodDecorator {
  return applyDecorators(
    ApiOkResponse({
      description: descriptionOkResponse,
      type: typeOkResponse,
    }),
    ApiBadRequestResponse({
      description: "Bad request",
      type: BadRequestExceptionDto,
    }),
    ApiNotFoundResponse({
      description: "Not found",
      type: NotFoundExceptionDto,
    }),
  );
}
