import envGlobal from "../env.global";

describe("env.global config", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    // Reset process.env to avoid pollution between tests
    process.env = { ...OLD_ENV };

    delete process.env.NODE_ENV;
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it("should return correct config from environment variables", () => {
    process.env.NODE_ENV = "test";
    process.env.BASE_URL = "http://localhost";
    process.env.SERVER_PORT = "3000";

    const config = envGlobal();

    expect(config).toEqual({
      server: {
        nodeEnv: "test",
        baseUrl: "http://localhost",
        port: 3000,
      },
    });
  });

  it("should return default values if environment variables are not set", () => {
    const config = envGlobal();

    expect(config).toEqual({
      server: {
        nodeEnv: "production",
        baseUrl: undefined,
        port: NaN,
      },
    });
  });
});
