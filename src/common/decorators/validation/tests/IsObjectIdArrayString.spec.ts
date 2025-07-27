import { validate } from "class-validator";

import {
  IsObjectIdArrayString,
  isObjectIdArrayString,
} from "../IsObjectIdArrayString";

describe("isObjectIdArrayString", () => {
  it("should return true for an array of valid ObjectId strings", () => {
    const validIds = [
      "507f1f77bcf86cd799439011",
      "507f191e810c19729de860ea",
      "000000000000000000000001",
    ];
    expect(isObjectIdArrayString(validIds)).toBe(true);
  });

  it("should return false for an array with invalid ObjectId strings", () => {
    const invalidIds = [
      "invalid-object-id",
      "123",
      "507f1f77bcf86cd79943901", // too short
      "507f1f77bcf86cd7994390111", // too long
    ];
    expect(isObjectIdArrayString(invalidIds)).toBe(false);
  });

  it("should return false if value is not an array", () => {
    expect(isObjectIdArrayString("507f1f77bcf86cd799439011")).toBe(false);
    expect(isObjectIdArrayString(123)).toBe(false);
    expect(isObjectIdArrayString({})).toBe(false);
    expect(isObjectIdArrayString(null)).toBe(false);
    expect(isObjectIdArrayString(undefined)).toBe(false);
  });

  it("should return true for an empty array", () => {
    expect(isObjectIdArrayString([])).toBe(true);
  });

  it("should return false for an array with mixed valid and invalid ObjectId strings", () => {
    const mixedIds = ["507f1f77bcf86cd799439011", "invalid-object-id"];
    expect(isObjectIdArrayString(mixedIds)).toBe(false);
  });
});

describe("IsObjectIdArrayString decorator", () => {
  class TestClass {
    @IsObjectIdArrayString()
    public ids: string[];
  }

  it("should validate a property with valid ObjectId array", async () => {
    const instance = new TestClass();
    instance.ids = ["507f1f77bcf86cd799439011", "507f191e810c19729de860ea"];
    const errors = await validate(instance);
    expect(errors.length).toBe(0);
  });

  it("should return validation error for property with invalid ObjectId array", async () => {
    const instance = new TestClass();
    instance.ids = ["invalid-object-id", "507f1f77bcf86cd799439011"];
    const errors = await validate(instance);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty("isObjectIdArrayString");
  });

  it("should return validation error for property that is not an array", async () => {
    const instance = new TestClass();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    instance.ids = "507f1f77bcf86cd799439011";
    const errors = await validate(instance);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty("isObjectIdArrayString");
  });
});
