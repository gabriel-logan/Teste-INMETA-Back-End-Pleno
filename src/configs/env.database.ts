import type { EnvDatabaseConfig } from "./types";

export default (): EnvDatabaseConfig => ({
  database: {
    mysql: {
      host: process.env.MYSQL_HOST!,
      port: parseInt(process.env.MYSQL_PORT!, 10),
      user: process.env.MYSQL_USER!,
      password: process.env.MYSQL_PASSWORD!,
      database: process.env.MYSQL_DATABASE!,
    },

    mongodb: {
      uri: process.env.MONGODB_URI!,
    },
  },
});
