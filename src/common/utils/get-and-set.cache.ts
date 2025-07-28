import type { Cache } from "@nestjs/cache-manager";

export default async function getAndSetCache<T>(
  cacheManager: Cache,
  key: string,
  fetchCbFn: () => Promise<T>,
): Promise<T> {
  const cached = await cacheManager.get<T>(key);

  if (cached) {
    return cached;
  }

  const data = await fetchCbFn();

  await cacheManager.set(key, data);

  return data;
}
