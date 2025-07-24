import type { Type } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common";
import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
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
    isArray?: boolean;
    statusCode?: HttpStatus;
  };
  badRequest?: boolean;
  notFound?: boolean;
  unauthorized?: boolean;
  forbidden?: boolean;
};

export function ApiStandardResponses(
  options: ResponseOptions,
): MethodDecorator & ClassDecorator {
  const decorators = new Array<MethodDecorator | ClassDecorator>(5);

  if (options.ok.statusCode === HttpStatus.CREATED) {
    decorators.push(
      ApiCreatedResponse({
        description: options.ok.description,
        type: options.ok.type,
        isArray: options.ok.isArray,
      }),
    );
  } else {
    decorators.push(
      ApiOkResponse({
        description: options.ok.description,
        type: options.ok.type,
        isArray: options.ok.isArray,
      }),
    );
  }

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

  if (options.unauthorized) {
    decorators.push(
      ApiBadRequestResponse({
        description: "Unauthorized",
        type: BadRequestExceptionDto,
      }),
    );
  }

  if (options.forbidden) {
    decorators.push(
      ApiBadRequestResponse({
        description: "Forbidden",
        type: BadRequestExceptionDto,
      }),
    );
  }

  return applyDecorators(...decorators);
}

export function ApiGlobalErrorResponses(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiInternalServerErrorResponse({
      description: "Internal server error",
      type: InternalServerErrorDto,
    }),
  );
}
