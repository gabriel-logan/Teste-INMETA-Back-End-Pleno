import type { ArgumentsHost } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common";
import type { Request, Response } from "express";
import type { MongoServerError } from "mongodb";

import { apiPrefix } from "../constants";
import { MongodbExceptionFilter } from "./mongodb-exception.filter";

describe("MongodbExceptionFilter", () => {
  let filter: MongodbExceptionFilter;
  let mockResponse: Response;
  let mockRequest: Request;
  let mockArgumentsHost: ArgumentsHost;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    filter = new MongodbExceptionFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    mockRequest = {
      url: `${apiPrefix}/employees`,
    } as unknown as Request;

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;
  });

  it("should return conflict error with CPF message for employee route", () => {
    const exception = {
      code: 11000,
      keyValue: { cpf: "12345678900" },
    } as unknown as MongoServerError;

    filter.catch(exception, mockArgumentsHost);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.CONFLICT,
      message: "The employee registered with CPF '12345678900' already exists.",
      error: "Conflict",
    });
  });

  it("should return default conflict message when value is not defined and route is employee", () => {
    mockRequest.url = `${apiPrefix}/employees`;
    const exception = {
      code: 11000,
      keyValue: { cpf: undefined },
    } as unknown as MongoServerError;

    filter.catch(exception, mockArgumentsHost);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.CONFLICT,
      message: "A conflict occurred due to a duplicate key.",
      error: "Conflict",
    });
  });

  it("should return conflict error with generic duplicate key message for non-employee route", () => {
    mockRequest.url = `${apiPrefix}/other`;
    const exception = {
      code: 11000,
      keyValue: { username: "john" },
    } as unknown as MongoServerError;

    filter.catch(exception, mockArgumentsHost);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.CONFLICT,
      message: "The value 'john' for the field 'username' already exists.",
      error: "Conflict",
    });
  });

  it("should return conflict error with default message if keyValue is missing", () => {
    mockRequest.url = `${apiPrefix}/other`;
    const exception = {
      code: 11000,
      keyValue: undefined,
    } as unknown as MongoServerError;

    filter.catch(exception, mockArgumentsHost);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.CONFLICT,
      message: "A conflict occurred due to a duplicate key.",
      error: "Conflict",
    });
  });

  it("should return internal server error for default errors", () => {
    const exception = {
      code: 99999,
    } as unknown as MongoServerError;

    filter.catch(exception, mockArgumentsHost);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "An unexpected error occurred.",
    });
  });
});
