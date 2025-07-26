import type { EnvTestConfig } from "./types";

export default (): EnvTestConfig => ({
  server: {
    nodeEnv: "test",

    baseUrl: "http://localhost:3000",

    port: 3000,
  },

  database: {
    mysql: {
      host: "localhost",
      port: 3306,
      user: "test_user",
      password: "123456", // nosonar
      database: "employee_management",
    },

    mongodb: {
      uri: "mongodb://localhost:27017/employee_management",
    },
  },

  jwtToken: {
    secret: "your_jwt_token_secret",
    expiration: "1d",
  },
});
