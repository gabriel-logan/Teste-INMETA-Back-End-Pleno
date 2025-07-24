import type { EnvGlobalConfig } from "./types";

const nodeEnv = process.env.NODE_ENV as
  | EnvGlobalConfig["server"]["nodeEnv"]
  | undefined;

export default (): EnvGlobalConfig => ({
  server: {
    nodeEnv: nodeEnv ?? "production",

    baseUrl: process.env.BASE_URL!,

    port: parseInt(process.env.SERVER_PORT!, 10),
  },
});
