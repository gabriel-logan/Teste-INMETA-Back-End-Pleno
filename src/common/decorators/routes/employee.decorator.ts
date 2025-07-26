import type { ExecutionContext } from "@nestjs/common";
import { createParamDecorator } from "@nestjs/common";
import type { Request } from "express";
import type { AuthPayload } from "src/common/types";

export const EmployeeFromReq = createParamDecorator(
  (data: keyof AuthPayload | undefined, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();

    const { employee } = request;

    return data ? employee?.[data] : employee;
  },
);
