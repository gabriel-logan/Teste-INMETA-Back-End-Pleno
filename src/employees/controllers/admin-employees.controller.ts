import { Body, Controller, Post } from "@nestjs/common";
import {
  ApiGlobalErrorResponses,
  ApiStandardResponses,
} from "src/common/decorators/routes/docs.decorator";
import { Public } from "src/common/decorators/routes/public.decorator";

import { CreateAdminEmployeeRequestDto } from "../dto/request/create-admin-employee.dto";
import { CreateAdminEmployeeResponseDto } from "../dto/response/create-admin-employee.dto";
import { AdminEmployeesService } from "../providers/admin-employees.service";

@ApiGlobalErrorResponses()
@Controller("admin-employees")
export class AdminEmployeesController {
  constructor(private readonly adminEmployeeService: AdminEmployeesService) {}

  @Public()
  @ApiStandardResponses({
    ok: {
      description:
        "Create a new admin employee - for internal use only - not exposed to public",
      type: CreateAdminEmployeeResponseDto,
      isStatusCodeCreated: true,
    },
    badRequest: true,
    isPublic: true,
    conflict: true,
  })
  @Post()
  async createAdminEmployee(
    @Body() createAdminEmployeeDto: CreateAdminEmployeeRequestDto,
  ): Promise<CreateAdminEmployeeResponseDto> {
    return await this.adminEmployeeService.createAdminEmployee(
      createAdminEmployeeDto,
    );
  }
}
