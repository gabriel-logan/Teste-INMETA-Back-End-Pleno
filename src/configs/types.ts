interface MysqlDatabase {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

interface MongoDatabase {
  uri: string;
}

export interface EnvDatabaseConfig {
  database: {
    mysql: MysqlDatabase;
    mongodb: MongoDatabase;
  };
}

export interface EnvGlobalConfig {
  server: {
    nodeEnv: "production" | "development" | "test";

    baseUrl: string;

    port: number;
  };
}

export interface EnvSecretConfig {
  jwtToken: {
    secret: string;
    expiration: string;
  };
}

export interface EnvTestConfig
  extends EnvGlobalConfig,
    EnvDatabaseConfig,
    EnvSecretConfig {}
