import { apiPrefix, cacheKeys, cacheTtl, fileValidation } from ".";

describe("cacheKeys", () => {
  describe("documentTypes", () => {
    it("should have correct findAll key", () => {
      expect(cacheKeys.documentTypes.findAll).toBe("documentTypes:findAll");
    });

    it("should generate correct findById key", () => {
      expect(cacheKeys.documentTypes.findById("123")).toBe(
        "documentTypes:findById:123",
      );
    });

    it("should generate correct findOneByName key", () => {
      expect(cacheKeys.documentTypes.findOneByName("passport")).toBe(
        "documentTypes:findOneByName:passport",
      );
    });
  });

  describe("employees", () => {
    it("should have correct findAll key", () => {
      expect(cacheKeys.employees.findAll).toBe("employees:findAll");
    });

    it("should generate correct findById key", () => {
      expect(cacheKeys.employees.findById("456")).toBe(
        "employees:findById:456",
      );
    });

    it("should generate correct findOneByUsername key", () => {
      expect(cacheKeys.employees.findOneByUsername("jdoe")).toBe(
        "employees:findOneByUsername:jdoe",
      );
    });
  });

  describe("documents", () => {
    it("should have correct findAll key", () => {
      expect(cacheKeys.documents.findAll).toBe("documents:findAll");
    });

    it("should generate correct findById key", () => {
      expect(cacheKeys.documents.findById("789")).toBe(
        "documents:findById:789",
      );
    });
  });

  describe("contractEvents", () => {
    it("should have correct findAll key", () => {
      expect(cacheKeys.contractEvents.findAll).toBe("contractEvents:findAll");
    });

    it("should generate correct findById key", () => {
      expect(cacheKeys.contractEvents.findById("101112")).toBe(
        "contractEvents:findById:101112",
      );
    });

    it("should generate correct findManyByIds key", () => {
      expect(cacheKeys.contractEvents.findManyByIds(["1", "2", "3"])).toBe(
        "contractEvents:findManyByIds:1,2,3",
      );
      expect(cacheKeys.contractEvents.findManyByIds([])).toBe(
        "contractEvents:findManyByIds:",
      );
      expect(cacheKeys.contractEvents.findManyByIds(["single"])).toBe(
        "contractEvents:findManyByIds:single",
      );
      expect(cacheKeys.contractEvents.findManyByIds(["awdawd"])).toBe(
        "contractEvents:findManyByIds:awdawd",
      );
    });
  });
});

describe("cacheTtl", () => {
  it("should be equal to 86400000 (1 day in ms)", () => {
    expect(cacheTtl).toBe(60000 * 60 * 24);
  });
});

describe("fileValidation", () => {
  describe("general", () => {
    it("should have correct maxSize", () => {
      expect(fileValidation.general.size.maxSize).toBe(1024 * 1024 * 5); // 5MB
    });

    it("should have correct message function", () => {
      const message = fileValidation.general.size.message(1024 * 1024 * 9);
      expect(message).toBe("File size should not exceed 9 MB");
    });
  });
});

describe("apiPrefix", () => {
  it("should be equal to '/api/v1'", () => {
    expect(apiPrefix).toBe("/api/v1");
  });
});
