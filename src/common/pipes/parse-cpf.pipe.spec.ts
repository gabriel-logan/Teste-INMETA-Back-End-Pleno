import { ParseCpfPipe } from "./parse-cpf.pipe";

describe("ParseCpfPipe", () => {
  let pipe: ParseCpfPipe;

  beforeEach(() => {
    pipe = new ParseCpfPipe();
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

  it("should throw BadRequestException for invalid CPF string", () => {
    expect(() => pipe.transform("invalid")).toThrow(
      "The provided value is not a valid CPF.",
    );
  });

  it("should return undefined if optional is true and value is undefined", () => {
    const optionalPipe = new ParseCpfPipe({ optional: true });
    expect(optionalPipe.transform(undefined)).toBeUndefined();
  });

  it("should throw BadRequestException if optional is true but value is not a string or undefined", () => {
    const optionalPipe = new ParseCpfPipe({ optional: true });
    expect(() => optionalPipe.transform(123)).toThrow(
      "Value is required and must be a string.",
    );
  });
});
