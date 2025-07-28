import type { Cache } from "@nestjs/cache-manager";

import { invalidateKeys, setMultipleKeys } from "./cache-utils";

describe("cache-utils", () => {
  let cache: Cache;

  beforeEach(() => {
    jest.clearAllMocks();

    cache = {
      del: jest.fn().mockResolvedValue(undefined),
      set: jest.fn().mockResolvedValue(undefined),
    } as unknown as Cache;
  });

  describe("invalidateKeys", () => {
    it("should call cache.del for each key", async () => {
      const keys = ["key1", "key2", "key3"];
      await invalidateKeys(cache, keys);
      expect(cache.del).toHaveBeenCalledTimes(keys.length);
      keys.forEach((key, idx) => {
        expect(cache.del).toHaveBeenNthCalledWith(idx + 1, key);
      });
    });

    it("should handle empty keys array", async () => {
      await invalidateKeys(cache, []);
      expect(cache.del).not.toHaveBeenCalled();
    });
  });

  describe("setMultipleKeys", () => {
    it("should call cache.set for each key with the same data", async () => {
      const keys = ["keyA", "keyB"];
      const data = { foo: "bar" };
      await setMultipleKeys(cache, data, keys);
      expect(cache.set).toHaveBeenCalledTimes(keys.length);
      keys.forEach((key, idx) => {
        expect(cache.set).toHaveBeenNthCalledWith(idx + 1, key, data);
      });
    });

    it("should handle empty keys array", async () => {
      await setMultipleKeys(cache, { foo: "bar" }, []);
      expect(cache.set).not.toHaveBeenCalled();
    });
  });
});
