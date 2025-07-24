import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
} from "@nestjs/swagger";

import { BadRequestExceptionDto } from "../dto/exception/bad-request.dto";
import { NotFoundExceptionDto } from "../dto/exception/not-found.dto";
import { PublicEmployeeResponseDto } from "../dto/response/public-employee.dto";

export function ApiFindAll(): MethodDecorator {
  return applyDecorators(
    ApiResponse({
      description: "List of all employees",
      type: [PublicEmployeeResponseDto],
    }),
  );
}

export function ApiFindById(): MethodDecorator {
  return applyDecorators(
    ApiOkResponse({
      description: "Employee details by ID",
      type: PublicEmployeeResponseDto,
    }),
    ApiNotFoundResponse({
      description: "Employee not found",
      type: NotFoundExceptionDto,
    }),
  );
}

export function ApiCreateEmployee(): MethodDecorator {
  return applyDecorators(
    ApiOkResponse({
      description: "Employee details by ID",
      type: PublicEmployeeResponseDto,
    }),
    ApiBadRequestResponse({
      description: "Bad request",
      type: BadRequestExceptionDto,
    }),
  );
}

export function ApiUpdateEmployee(): MethodDecorator {
  return applyDecorators(
    ApiOkResponse({
      description: "Employee details by ID",
      type: PublicEmployeeResponseDto,
    }),
    ApiBadRequestResponse({
      description: "Bad request",
      type: BadRequestExceptionDto,
    }),
    ApiNotFoundResponse({
      description: "Employee not found",
      type: NotFoundExceptionDto,
    }),
  );
}

export function ApiDeleteEmployee(): MethodDecorator {
  return applyDecorators(ApiFindById());
}
