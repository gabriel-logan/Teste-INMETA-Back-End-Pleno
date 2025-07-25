import type { Type } from "@nestjs/common";
import { applyDecorators, HttpStatus } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from "@nestjs/swagger";
import { BadRequestExceptionDto } from "src/common/dto/exception/bad-request.dto";
import { ConflictExceptionDto } from "src/common/dto/exception/conflict.dto";
import { InternalServerErrorDto } from "src/common/dto/exception/internal-server-error.dto";
import { NotFoundExceptionDto } from "src/common/dto/exception/not-found.dto";

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
  conflict?: boolean;
  notFound?: boolean;
  unauthorized?: boolean;
  forbidden?: boolean;
};

export function ApiStandardResponses(
  options: ResponseOptions,
): MethodDecorator & ClassDecorator {
  const decorators: (MethodDecorator | ClassDecorator)[] = [];

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

  if (options.conflict) {
    decorators.push(
      ApiConflictResponse({
        description: "Conflict",
        type: ConflictExceptionDto,
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

export function ApiTypeFormData(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiConsumes("multipart/form-data"),
    ApiBody({
      description: "Document file to be sent",
      schema: {
        type: "object",
        properties: {
          documentFile: {
            type: "string",
            format: "binary",
          },
        },
      },
    }),
  );
}
