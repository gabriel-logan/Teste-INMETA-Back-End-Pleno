import type { EnvSecretConfig } from "./types";

export default (): EnvSecretConfig => ({
  token: {
    secret: process.env.JWT_TOKEN_SECRET!,
    expiration: process.env.JWT_TOKEN_EXPIRATION ?? "1d",
  },
});
