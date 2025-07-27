export const cacheKeys = {
  documentTypes: {
    findAll: "documentTypes:findAll",
    findById: (id: string): string => `documentTypes:findById:${id}`,
    findOneByName: (name: string): string =>
      `documentTypes:findOneByName:${name}`,
  },

  employees: {
    findAll: "employees:findAll",
    findById: (id: string): string => `employees:findById:${id}`,
    findOneByUsername: (username: string): string =>
      `employees:findOneByUsername:${username}`,
  },

  documents: {
    findAll: "documents:findAll",
    findById: (id: string): string => `documents:findById:${id}`,
  },
};

export const cacheTtl = 60000 * 60; // 1 hour
