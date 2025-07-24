import type { EnvGlobalConfig } from "./types";

export default (): EnvGlobalConfig => {
  const nodeEnv = process.env.NODE_ENV as
    | EnvGlobalConfig["server"]["nodeEnv"]
    | undefined;

  return {
    server: {
      nodeEnv: nodeEnv ?? "production",

      baseUrl: process.env.BASE_URL!,

      port: parseInt(process.env.SERVER_PORT!, 10),
    },
  };
};
