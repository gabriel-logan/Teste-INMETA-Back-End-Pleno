import { ParseCpfPipe } from "./parse-cpf.pipe";

describe("ParseCpfPipe", () => {
  let pipe: ParseCpfPipe;

  beforeEach(() => {
    pipe = new ParseCpfPipe();
  });

  it("should throw BadRequestException if value is not a string", () => {
    expect(() => pipe.transform(123)).toThrow(
      "The provided value is not a valid CPF.",
    );
    expect(() => pipe.transform(null)).toThrow(
      "The provided value is not a valid CPF.",
    );
    expect(() => pipe.transform({})).toThrow(
      "The provided value is not a valid CPF.",
    );
  });

  it("should throw BadRequestException for invalid CPF string", () => {
    expect(() => pipe.transform("invalid")).toThrow(
      "The provided value is not a valid CPF.",
    );
  });

  it("should return cleaned CPF string for valid CPF", () => {
    const validCpf = "123.456.789-09";
    expect(pipe.transform(validCpf)).toBe("12345678909");
  });

  it("should return undefined if optional is true and value is undefined", () => {
    const optionalPipe = new ParseCpfPipe({ optional: true });
    expect(optionalPipe.transform(undefined)).toBeUndefined();
  });

  it("should throw BadRequestException if optional is true but value is not a string or undefined", () => {
    const optionalPipe = new ParseCpfPipe({ optional: true });
    expect(() => optionalPipe.transform(123)).toThrow(
      "The provided value is not a valid CPF.",
    );
  });
});
