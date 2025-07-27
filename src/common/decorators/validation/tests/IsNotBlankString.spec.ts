import { validate } from "class-validator";

import { IsNotBlankString, isNotBlankString } from "../IsNotBlankString";

describe("isNotBlankString", () => {
  it("should return false for non-string values", () => {
    expect(isNotBlankString(null)).toBe(false);
    expect(isNotBlankString(undefined)).toBe(false);
    expect(isNotBlankString(123)).toBe(false);
    expect(isNotBlankString({})).toBe(false);
    expect(isNotBlankString([])).toBe(false);
    expect(isNotBlankString(true)).toBe(false);
  });

  it("should return false for blank strings", () => {
    expect(isNotBlankString("")).toBe(false);
    expect(isNotBlankString("   ")).toBe(false);
    expect(isNotBlankString("\n\t")).toBe(false);
  });

  it("should return true for non-blank strings", () => {
    expect(isNotBlankString("hello")).toBe(true);
    expect(isNotBlankString("  world  ")).toBe(true);
    expect(isNotBlankString("a")).toBe(true);
    expect(isNotBlankString("0")).toBe(true);
  });
});

describe("IsNotBlankString decorator", () => {
  class TestClass {
    @IsNotBlankString()
    public value!: string;
  }

  it("should validate non-blank string", async () => {
    const instance = new TestClass();
    instance.value = "valid";
    const errors = await validate(instance);
    expect(errors.length).toBe(0);
  });

  it("should invalidate blank string", async () => {
    const instance = new TestClass();
    instance.value = "   ";
    const errors = await validate(instance);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.isNotBlankString).toContain(
      "should be a non-blank string",
    );
  });

  it("should invalidate non-string value", async () => {
    const instance = new TestClass();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    instance.value = null;
    const errors = await validate(instance);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.isNotBlankString).toContain(
      "should be a non-blank string",
    );
  });
});
