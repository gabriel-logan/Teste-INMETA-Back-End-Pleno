import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { MongoServerError } from "mongodb";

import { apiPrefix } from "../constants";

@Catch(MongoServerError)
export class MongodbExceptionFilter implements ExceptionFilter {
  catch(exception: MongoServerError, host: ArgumentsHost): Response {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();

    if (exception.code === 11000) {
      const request = ctx.getRequest<Request>();
      const url = request.url;

      const keyValue = exception.keyValue as Record<string, string> | undefined;
      const key = Object.keys(keyValue || {})[0];
      const value = keyValue?.[key];

      // This is necessary because COMMON employees CPF is equal to the username
      // and BOTH are unique in the database.
      // If the CPF is already registered, it will return a conflict error. The same applies to the username.
      // This is a workaround to provide a more user-friendly error message.
      // If this is not set, the error will be generic about username uniqueness. But we want to provide a specific message for CPF uniqueness.
      const isEmployeeRoute = url.startsWith(`${apiPrefix}/employees`);

      const defaultMessage = "A conflict occurred due to a duplicate key.";

      let message: string = defaultMessage;

      if (isEmployeeRoute) {
        message = value
          ? `The employee registered with CPF '${value}' already exists.`
          : defaultMessage;
      } else if (value) {
        message = `The value '${value}' for the field '${key}' already exists.`;
      }

      return response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message,
        error: "Conflict",
      });
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "An unexpected error occurred.",
    });
  }
}
