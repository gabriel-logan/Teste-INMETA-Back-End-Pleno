import type { Type } from "@nestjs/common";
import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiSecurity,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { BadRequestExceptionDto } from "src/common/dto/exception/bad-request.dto";
import { ConflictExceptionDto } from "src/common/dto/exception/conflict.dto";
import { ForbiddenExceptionDto } from "src/common/dto/exception/forbidden.dto";
import { InternalServerErrorDto } from "src/common/dto/exception/internal-server-error.dto";
import { NotFoundExceptionDto } from "src/common/dto/exception/not-found.dto";
import { ThrottlerExceptionDto } from "src/common/dto/exception/throttler.dto";
import { UnauthorizedExceptionDto } from "src/common/dto/exception/unauthorized.dto";
import { ContractStatus } from "src/employees/schemas/employee.schema";

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
    isArray?: true;
    isStatusCodeCreated?: true;
  };
  badRequest?: true;
  conflict?: true;
  notFound?: true;
  unauthorized?: true;
  forbidden?: true;
  isPublic?: true;
};

export function ApiStandardResponses(
  options: ResponseOptions,
): MethodDecorator & ClassDecorator {
  const decorators: (MethodDecorator | ClassDecorator)[] = [];

  if (!options.isPublic) {
    decorators.push(ApiSecurity("bearer"));
  }

  if (options.ok.isStatusCodeCreated) {
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

  if (options.unauthorized || !options.isPublic) {
    decorators.push(
      ApiUnauthorizedResponse({
        description: "Unauthorized",
        type: UnauthorizedExceptionDto,
      }),
    );
  }

  if (options.forbidden || !options.isPublic) {
    decorators.push(
      ApiForbiddenResponse({
        description: "Forbidden",
        type: ForbiddenExceptionDto,
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
    ApiTooManyRequestsResponse({
      description: "Too many requests",
      type: ThrottlerExceptionDto,
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

export function ApiGetAllMissingDocumentsQueries(): MethodDecorator &
  ClassDecorator {
  return applyDecorators(
    ApiQuery({
      name: "page",
      required: false,
      type: Number,
      description: "Page number for pagination",
    }),
    ApiQuery({
      name: "limit",
      required: false,
      type: Number,
      description: "Number of documents per page",
    }),
    ApiQuery({
      name: "employeeId",
      required: false,
      type: String,
      format: "ObjectId",
      description: "Filter by employee ID",
    }),
    ApiQuery({
      name: "documentTypeId",
      required: false,
      type: String,
      format: "ObjectId",
      description: "Filter by document type ID",
    }),
  );
}

export function ApiGetAllEmployeesQueries(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiQuery({
      name: "byFirstName",
      required: false,
      type: String,
      description: "Filter by employee's first name",
    }),
    ApiQuery({
      name: "byLastName",
      required: false,
      type: String,
      description: "Filter by employee's last name",
    }),
    ApiQuery({
      name: "byContractStatus",
      required: false,
      type: String,
      enum: ContractStatus,
      description: "Filter by employee's contract status",
    }),
    ApiQuery({
      name: "byDocumentTypeId",
      required: false,
      type: String,
      format: "ObjectId",
      description: "Filter by document type ID",
    }),
    ApiQuery({
      name: "byCpf",
      required: false,
      type: String,
      description: "Filter by employee's CPF (Brazilian ID)",
    }),
  );
}
