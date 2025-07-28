import swaggerInitializer, { operationsSorter } from "../swagger";

describe("swaggerInitializer", () => {
  it("should be defined", () => {
    expect(swaggerInitializer).toBeDefined();
  });
});

describe("operationsSorter", () => {
  it("should sort methods according to methodOrder", () => {
    const getParam = (
      method: string,
    ): {
      get: (type: string) => string;
    } => ({
      get: (type: string) => (type === "method" ? method : ""),
    });

    const methods = ["get", "post", "patch", "put", "delete"];
    for (let i = 0; i < methods.length - 1; i++) {
      const a = getParam(methods[i]);
      const b = getParam(methods[i + 1]);
      expect(operationsSorter(a, b)).toBeLessThan(0);
      expect(operationsSorter(b, a /** nosonar */)).toBeGreaterThan(0);
    }
  });

  it("should return 0 for same method", () => {
    const getParam = (
      method: string,
    ): {
      get: (type: string) => string;
    } => ({
      get: (type: string) => (type === "method" ? method : ""),
    });
    expect(operationsSorter(getParam("get"), getParam("get"))).toBe(0);
  });
});
