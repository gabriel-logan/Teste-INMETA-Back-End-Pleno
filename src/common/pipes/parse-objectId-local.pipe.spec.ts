import { ParseObjectIdPipeLocal } from "./parse-objectId-local.pipe";

describe("ParseObjectIdPipeLocal", () => {
  let pipe: ParseObjectIdPipeLocal;

  beforeEach(() => {
    pipe = new ParseObjectIdPipeLocal();
  });

  it("should throw BadRequestException if value is not a string", () => {
    expect(() => pipe.transform(123)).toThrow(
      "Value is required and must be a string.",
    );
    expect(() => pipe.transform(null)).toThrow(
      "Value is required and must be a string.",
    );
    expect(() => pipe.transform({})).toThrow(
      "Value is required and must be a string.",
    );
  });

  it("should return ObjectId for valid string", () => {
    const validId = "507f1f77bcf86cd799439011";
    const result = pipe.transform(validId);
    expect(result).toBeInstanceOf(Object);
    expect(result.toHexString()).toBe(validId);
  });

  it("should throw BadRequestException for invalid ObjectId string", () => {
    expect(() => pipe.transform("invalid")).toThrow();
  });

  it("should return undefined if optional is true and value is undefined", () => {
    const optionalPipe = new ParseObjectIdPipeLocal({ optional: true });
    expect(optionalPipe.transform(undefined)).toBeUndefined();
  });

  it("should throw BadRequestException if optional is true but value is not a string or undefined", () => {
    const optionalPipe = new ParseObjectIdPipeLocal({ optional: true });
    expect(() => optionalPipe.transform(123)).toThrow(
      "Value is required and must be a string.",
    );
  });
});
