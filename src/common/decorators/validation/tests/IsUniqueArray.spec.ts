import { validate } from "class-validator";

import { IsUniqueArray, isUniqueArray } from "../IsUniqueArray";

describe("isUniqueArray", () => {
  it("should return false for non-array values", () => {
    expect(isUniqueArray(null)).toBe(false);
    expect(isUniqueArray(undefined)).toBe(false);
    expect(isUniqueArray("string")).toBe(false);
    expect(isUniqueArray(123)).toBe(false);
    expect(isUniqueArray({})).toBe(false);
  });

  it("should return true for empty array", () => {
    expect(isUniqueArray([])).toBe(true);
  });

  it("should return true for array with unique strings", () => {
    expect(isUniqueArray(["a", "b", "c"])).toBe(true);
  });

  it("should return false for array with duplicate strings", () => {
    expect(isUniqueArray(["a", "b", "a"])).toBe(false);
  });

  it("should trim strings before checking uniqueness", () => {
    expect(isUniqueArray(["a", " a ", "b"])).toBe(false);
    expect(isUniqueArray(["a", "b", " c ", "c"])).toBe(false);
  });

  it("should handle arrays with non-string values", () => {
    expect(isUniqueArray([1, 2, 3])).toBe(true);
    expect(isUniqueArray([1, 2, 1])).toBe(false);
    expect(isUniqueArray([{ a: 1 }, { a: 2 }, { a: 1 }])).toBe(false);
    expect(isUniqueArray([{ a: 1 }, { a: 2 }, { a: 3 }])).toBe(true);
  });

  it("should handle mixed type arrays", () => {
    expect(isUniqueArray(["a", { a: 1 }, "a"])).toBe(false);
  });
});

describe("IsUniqueArray decorator", () => {
  class TestClass {
    @IsUniqueArray()
    public arr!: any[];
  }

  it("should validate unique array", async () => {
    const instance = new TestClass();
    instance.arr = ["a", "b", "c"];
    const errors = await validate(instance);
    expect(errors.length).toBe(0);
  });

  it("should invalidate array with duplicates", async () => {
    const instance = new TestClass();
    instance.arr = ["a", "b", "a"];
    const errors = await validate(instance);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty("isUniqueArray");
  });

  it("should invalidate non-array values", async () => {
    const instance = new TestClass();
    // @ts-expect-error: TypeScript will catch this as an error
    instance.arr = "not-an-array";
    const errors = await validate(instance);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty("isUniqueArray");
  });
});
