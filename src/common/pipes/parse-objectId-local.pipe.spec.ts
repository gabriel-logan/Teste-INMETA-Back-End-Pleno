import type { ArgumentMetadata } from "@nestjs/common";

import { ParseObjectIdPipeLocal } from "./parse-objectId-local.pipe";

describe("ParseObjectIdPipeLocal", () => {
  let pipe: ParseObjectIdPipeLocal;
  let defaultMetadata: ArgumentMetadata;

  beforeAll(() => {
    defaultMetadata = {
      type: "query",
      metatype: String,
      data: "",
    };
  });

  beforeEach(() => {
    pipe = new ParseObjectIdPipeLocal();
  });

  it("should throw BadRequestException if value is not a string", () => {
    expect(() => pipe.transform(123, defaultMetadata)).toThrow(
      "Value is required and must be a string.",
    );
    expect(() => pipe.transform(null, defaultMetadata)).toThrow(
      "Value is required and must be a string.",
    );
    expect(() => pipe.transform({}, defaultMetadata)).toThrow(
      "Value is required and must be a string.",
    );
  });

  it("should return ObjectId for valid string", () => {
    const validId = "507f1f77bcf86cd799439011";
    const result = pipe.transform(validId, defaultMetadata);
    expect(result).toBeInstanceOf(Object);
    expect(result.toHexString()).toBe(validId);
  });

  it("should throw BadRequestException for invalid ObjectId string", () => {
    expect(() => pipe.transform("invalid", defaultMetadata)).toThrow();
  });

  it("should return undefined if optional is true and value is undefined", () => {
    const optionalPipe = new ParseObjectIdPipeLocal({ optional: true });
    expect(optionalPipe.transform(undefined, defaultMetadata)).toBeUndefined();
  });

  it("should throw BadRequestException if optional is true but value is not a string or undefined", () => {
    const optionalPipe = new ParseObjectIdPipeLocal({ optional: true });
    expect(() => optionalPipe.transform(123, defaultMetadata)).toThrow(
      "Value is required and must be a string.",
    );
  });
});
