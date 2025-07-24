import type { EnvSecretConfig } from "./types";

export default (): EnvSecretConfig => ({
  jwtToken: {
    secret: process.env.JWT_TOKEN_SECRET!,
    expiration: process.env.JWT_TOKEN_EXPIRATION ?? "1d",
  },
});
