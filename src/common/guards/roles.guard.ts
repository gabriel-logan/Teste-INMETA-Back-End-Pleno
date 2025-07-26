import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import { EmployeeRole } from "src/employees/schemas/employee.schema";

import { ROLES_KEY } from "../decorators/routes/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<
      EmployeeRole[] | undefined
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();

    const employee = request["employee"];

    if (!employee) {
      return false;
    }

    return requiredRoles.some((role) => employee.role.includes(role));
  }
}
