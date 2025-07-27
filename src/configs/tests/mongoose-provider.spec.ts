import type { Connection } from "mongoose";

import { MongooseProvider } from "../mongoose-provider";

describe("MongooseProvider", () => {
  const mockConnection = {} as Connection;

  afterEach(() => {
    MongooseProvider.clearMongooseInstance();
  });

  it("should set and get mongoose instance", () => {
    MongooseProvider.setMongooseInstance(mockConnection);
    expect(MongooseProvider.getMongooseInstance()).toBe(mockConnection);
  });

  it("should throw error if instance is not set", () => {
    expect(() => MongooseProvider.getMongooseInstance()).toThrow(
      "Mongoose instance has not been set in the MongooseProvider.",
    );
  });

  it("should throw custom error message if provided", () => {
    const customMsg = "Custom error message";
    expect(() => MongooseProvider.getMongooseInstance(customMsg)).toThrow(
      customMsg,
    );
  });

  it("should clear mongoose instance", () => {
    MongooseProvider.setMongooseInstance(mockConnection);
    MongooseProvider.clearMongooseInstance();
    expect(() => MongooseProvider.getMongooseInstance()).toThrow();
  });
});
