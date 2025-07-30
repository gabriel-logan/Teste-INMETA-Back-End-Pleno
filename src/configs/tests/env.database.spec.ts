import envDatabase from "../env.database";

describe("env.database config", () => {
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

  it("should return correct mysql and mongodb config from environment variables", () => {
    process.env.MYSQL_HOST = "localhost";
    process.env.MYSQL_PORT = "3306";
    process.env.MYSQL_USER = "testuser";
    process.env.MYSQL_PASSWORD = "testpass";
    process.env.MYSQL_DATABASE = "testdb";
    process.env.MONGODB_URI = "mongodb://localhost:27017/testdb";
    process.env.MONGODB_AUTO_CREATE = "true";

    const config = envDatabase();

    expect(config).toEqual({
      database: {
        mysql: {
          host: "localhost",
          port: 3306,
          user: "testuser",
          password: "testpass",
          database: "testdb",
        },
        mongodb: {
          uri: "mongodb://localhost:27017/testdb",
          autoCreate: true,
        },
      },
    });
  });
});
