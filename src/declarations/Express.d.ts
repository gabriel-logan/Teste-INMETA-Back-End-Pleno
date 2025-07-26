import type { AuthPayload } from "../common/types";

declare module "express" {
  interface Request {
    employee?: AuthPayload;
  }
}
