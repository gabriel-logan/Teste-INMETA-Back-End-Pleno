import { cacheKeys, cacheTtl } from ".";

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
});

describe("cacheTtl", () => {
  it("should be equal to 3600000 (1 hour in ms)", () => {
    expect(cacheTtl).toBe(60000 * 60);
  });
});
