import type { Connection } from "mongoose";
import { MongooseProvider } from "src/configs/mongoose-provider";

import { Transactional } from "./Transactional";

describe("Transactional decorator", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const mockConnection: Connection = {
      transaction: jest.fn().mockImplementation(async (callback) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        return await callback({
          startTransaction: jest.fn(),
          commitTransaction: jest.fn(),
          abortTransaction: jest.fn(),
          endSession: jest.fn(),
        });
      }),
    } as unknown as Connection;

    MongooseProvider.setMongooseInstance(mockConnection);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should throw error if applied to non-method", () => {
    expect(() => {
      Transactional()({}, "test", {});
    }).toThrow("Transactional decorator can only be applied to methods.");
  });

  it("should start and complete transaction successfully", async () => {
    const mockMethod = jest.fn().mockResolvedValue("result");

    class TestClass {
      @Transactional()
      async testMethod(): Promise<any> {
        return await mockMethod();
      }
    }

    const instance = new TestClass();
    const result = (await instance.testMethod()) as Promise<any>;

    expect(mockMethod).toHaveBeenCalled();
    expect(result).toBe("result");
  });

  it("should log error and throw if transaction fails", async () => {
    const mockMethod = jest
      .fn()
      .mockRejectedValue(new Error("Transaction failed"));

    class TestClass {
      @Transactional()
      async testMethod(): Promise<any> {
        return await mockMethod();
      }
    }

    const instance = new TestClass();

    await expect(instance.testMethod()).rejects.toThrow("Transaction failed");
    expect(mockMethod).toHaveBeenCalled();
  });
});
