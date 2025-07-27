import { validate } from "class-validator";

import { IsCpf, isCpf } from "../IsCpf";

describe("isCpf", () => {
  it("should return false for non-string and non-number values", () => {
    expect(isCpf(null)).toBe(false);
    expect(isCpf(undefined)).toBe(false);
    expect(isCpf({})).toBe(false);
    expect(isCpf([])).toBe(false);
    expect(isCpf(true)).toBe(false);
  });

  it("should return true for valid CPF strings", () => {
    // 123.456.789-09 is a commonly used valid CPF for testing
    expect(isCpf("123.456.789-09")).toBe(true);
    expect(isCpf("935.411.347-80")).toBe(true);
    expect(isCpf("93541134780")).toBe(true);
  });

  it("should return false for invalid CPF strings", () => {
    expect(isCpf("111.111.111-11")).toBe(false);
    expect(isCpf("000.000.000-00")).toBe(false);
    expect(isCpf("abc.def.ghi-jk")).toBe(false);
    expect(isCpf("")).toBe(false);
    expect(isCpf("  ")).toBe(false);
  });

  it("should return true for valid CPF numbers", () => {
    expect(isCpf(93541134780)).toBe(true);
  });

  it("should return false for invalid CPF numbers", () => {
    expect(isCpf(11111111111)).toBe(false);
    expect(isCpf(0)).toBe(false);
  });
});

describe("IsCpf decorator", () => {
  class TestClass {
    @IsCpf()
    public cpf!: string;
  }

  it("should validate a valid CPF", async () => {
    const instance = new TestClass();
    instance.cpf = "935.411.347-80";
    const errors = await validate(instance);
    expect(errors.length).toBe(0);
  });

  it("should invalidate an invalid CPF", async () => {
    const instance = new TestClass();
    instance.cpf = "111.111.111-11";
    const errors = await validate(instance);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty("isCpf");
    expect(errors[0].constraints?.isCpf).toMatch(/must be a valid CPF/);
  });
});
