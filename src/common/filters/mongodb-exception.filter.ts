import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import type { Response } from "express";
import { MongoServerError } from "mongodb";

@Catch(MongoServerError)
export class MongodbExceptionFilter implements ExceptionFilter {
  catch(exception: MongoServerError, host: ArgumentsHost): Response {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();

    if (exception.code === 11000) {
      const keyValue = exception.keyValue as Record<string, string> | undefined;
      const key = Object.keys(keyValue || {})[0];
      const value = keyValue?.[key];

      return response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message: value
          ? `The value '${value}' for the field '${key}' already exists.`
          : "A conflict occurred due to a duplicate key.",
        error: "Conflict",
      });
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "An unexpected error occurred.",
    });
  }
}
