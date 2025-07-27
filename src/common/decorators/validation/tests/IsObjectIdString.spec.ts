import { validate } from "class-validator";

import { IsObjectIdString, isObjectIdString } from "../IsObjectIdString";

describe("isObjectIdString", () => {
  it("should return true for valid ObjectId strings", () => {
    // Example valid ObjectId
    const validId = "507f1f77bcf86cd799439011";
    expect(isObjectIdString(validId)).toBe(true);
  });

  it("should return false for invalid ObjectId strings", () => {
    expect(isObjectIdString("invalid-object-id")).toBe(false);
    expect(isObjectIdString("123")).toBe(false);
    expect(isObjectIdString("")).toBe(false);
    expect(isObjectIdString("507f1f77bcf86cd79943901")).toBe(false); // 23 chars
    expect(isObjectIdString("507f1f77bcf86cd7994390111")).toBe(false); // 25 chars
  });

  it("should return false for non-string values", () => {
    expect(isObjectIdString(123)).toBe(false);
    expect(isObjectIdString(null)).toBe(false);
    expect(isObjectIdString(undefined)).toBe(false);
    expect(isObjectIdString({})).toBe(false);
    expect(isObjectIdString([])).toBe(false);
  });
});

describe("IsObjectIdString decorator", () => {
  class TestClass {
    @IsObjectIdString()
    public id!: string;
  }

  it("should validate a valid ObjectId string", async () => {
    const instance = new TestClass();
    instance.id = "507f1f77bcf86cd799439011";
    const errors = await validate(instance);
    expect(errors.length).toBe(0);
  });

  it("should invalidate an invalid ObjectId string", async () => {
    const instance = new TestClass();
    instance.id = "invalid-object-id";
    const errors = await validate(instance);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isObjectIdString).toContain(
      "must be a valid string ObjectId format",
    );
  });

  it("should invalidate a non-string value", async () => {
    const instance = new TestClass();
    // @ts-expect-error: testing runtime validation
    instance.id = 123;
    const errors = await validate(instance);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isObjectIdString).toContain(
      "must be a valid string ObjectId format",
    );
  });
});
