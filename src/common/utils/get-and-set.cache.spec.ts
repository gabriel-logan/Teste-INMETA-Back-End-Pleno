import type { Cache } from "@nestjs/cache-manager";

import getAndSetCache from "./get-and-set.cache";

describe("getAndSetCache", () => {
  const key = "test-key";
  let cacheManager: Cache;
  let fetchCbFn: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    fetchCbFn = jest.fn();

    cacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    } as unknown as Cache;
  });

  it("should return cached value if present", async () => {
    jest.spyOn(cacheManager, "get").mockResolvedValue("cached-value");

    const result = await getAndSetCache(cacheManager, key, fetchCbFn);

    expect(result).toBe("cached-value");
    expect(cacheManager.get).toHaveBeenCalledWith(key);
    expect(fetchCbFn).not.toHaveBeenCalled();
    expect(cacheManager.set).not.toHaveBeenCalled();
  });

  it("should fetch, set, and return value if not cached", async () => {
    jest.spyOn(cacheManager, "get").mockResolvedValue(undefined);
    fetchCbFn.mockResolvedValue("fetched-value");

    const result = await getAndSetCache(cacheManager, key, fetchCbFn);

    expect(cacheManager.get).toHaveBeenCalledWith(key);
    expect(fetchCbFn).toHaveBeenCalled();
    expect(cacheManager.set).toHaveBeenCalledWith(key, "fetched-value");
    expect(result).toBe("fetched-value");
  });

  it("should propagate errors from fetchCbFn", async () => {
    jest.spyOn(cacheManager, "get").mockResolvedValue(undefined);
    fetchCbFn.mockRejectedValue(new Error("fetch error"));

    await expect(getAndSetCache(cacheManager, key, fetchCbFn)).rejects.toThrow(
      "fetch error",
    );
    expect(cacheManager.set).not.toHaveBeenCalled();
  });

  it("should propagate errors from cacheManager.get", async () => {
    jest
      .spyOn(cacheManager, "get")
      .mockRejectedValue(new Error("cache get error"));

    await expect(getAndSetCache(cacheManager, key, fetchCbFn)).rejects.toThrow(
      "cache get error",
    );
    expect(fetchCbFn).not.toHaveBeenCalled();
    expect(cacheManager.set).not.toHaveBeenCalled();
  });

  it("should propagate errors from cacheManager.set", async () => {
    jest.spyOn(cacheManager, "get").mockResolvedValue(undefined);
    jest
      .spyOn(fetchCbFn, "mockResolvedValue")
      .mockResolvedValue("fetched-value" as never);
    jest
      .spyOn(cacheManager, "set")
      .mockRejectedValue(new Error("cache set error"));

    await expect(getAndSetCache(cacheManager, key, fetchCbFn)).rejects.toThrow(
      "cache set error",
    );
  });
});
