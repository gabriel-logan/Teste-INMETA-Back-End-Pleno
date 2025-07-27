export const cacheKeys = {
  documentTypes: {
    findAll: "documentTypes:findAll",
    findById: (id: string): string => `documentTypes:findById:${id}`,
    findOneByName: (name: string): string =>
      `documentTypes:findOneByName:${name}`,
  },
};

export const cacheTtl = 60000 * 60; // 1 hour
