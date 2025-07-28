export const cacheKeys = {
  documentTypes: {
    findAll: "documentTypes:findAll",
    findById: (id: string): string => `documentTypes:findById:${id}`,
    findOneByName: (name: string): string =>
      `documentTypes:findOneByName:${name}`,
  },

  contractEvents: {
    findAll: "contractEvents:findAll",
    findById: (id: string): string => `contractEvents:findById:${id}`,
    findManyByIds: (ids: string[]): string =>
      `contractEvents:findManyByIds:${ids.join(",")}`,
    findAllByEmployeeCpf: (employeeCpf: string): string =>
      `contractEvents:findAllByEmployeeCpf:${employeeCpf}`,
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

export const cacheTtl = 60000 * 60 * 24; // 1 day

export const fileValidation = {
  general: {
    size: {
      maxSize: 1024 * 1024 * 5, // 5MB
      message: (maxSize: number): string =>
        `File size should not exceed ${maxSize / 1024 / 1024} MB`,
    },
  },
};

export const apiPrefix = "/api/v1";
