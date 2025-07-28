import type { Cache } from "@nestjs/cache-manager";
import { Logger } from "@nestjs/common";

const logger = new Logger("getAndSetCache");

export default async function getAndSetCache<T>(
  cacheManager: Cache,
  key: string,
  fetchCbFn: () => Promise<T>,
): Promise<T> {
  const cached = await cacheManager.get<T>(key);

  if (cached) {
    logger.debug(`Returning cached data for key: ${key} \n`);
    return cached;
  }

  logger.debug(`Fetching data for key: ${key} - Cache miss \n`);

  const data = await fetchCbFn();

  await cacheManager.set(key, data);

  return data;
}
