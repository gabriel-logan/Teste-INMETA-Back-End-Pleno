import envSecrets from "../env.secrets";

describe("env.global config", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    // Reset process.env to avoid pollution between tests
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it("should return correct config from environment variables", () => {
    process.env.JWT_TOKEN_SECRET = "testjwtsecret";
    process.env.JWT_TOKEN_EXPIRATION = "1h";

    const config = envSecrets();

    expect(config).toEqual({
      jwtToken: {
        secret: "testjwtsecret",
        expiration: "1h",
      },
    });
  });

  it("should return default values if environment variables are not set", () => {
    const config = envSecrets();

    expect(config).toEqual({
      jwtToken: {
        secret: undefined,
        expiration: "1d",
      },
    });
  });
});
