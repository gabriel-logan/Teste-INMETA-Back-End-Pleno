import type { EnvGlobalConfig } from "./types";

export default (): EnvGlobalConfig => ({
  server: {
    nodeEnv: process.env.NODE_ENV ?? "production",

    baseUrl: process.env.BASE_URL!,

    port: parseInt(process.env.SERVER_PORT!, 10),
  },
});
