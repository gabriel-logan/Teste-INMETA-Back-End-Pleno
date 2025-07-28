import type { Cache } from "@nestjs/cache-manager";

export async function invalidateKeys(
  cache: Cache,
  keys: string[],
): Promise<void> {
  await Promise.all(keys.map((key) => cache.del(key)));
}

export async function setMultipleKeys<T>(
  cache: Cache,
  data: T,
  keys: string[],
): Promise<void> {
  await Promise.all(keys.map((key) => cache.set(key, data)));
}
