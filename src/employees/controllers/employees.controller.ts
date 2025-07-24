import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiInternalServerErrorResponse, ApiResponse } from "@nestjs/swagger";
import {
  ApiOkAndBadRequestAndNotFoundResponse,
  ApiOkAndBadRequestResponse,
  ApiOkAndNotFoundResponse,
} from "src/common/decorators/routes/docs";

import { InternalServerErrorDto } from "../../common/dto/exception/internal-server-error.dto";
import { CreateEmployeeRequestDto } from "../dto/request/create-employee.dto";
import { UpdateEmployeeRequestDto } from "../dto/request/update-employee.dto";
import { PublicEmployeeResponseDto } from "../dto/response/public-employee.dto";
import { EmployeesService } from "../providers/employees.service";

@ApiInternalServerErrorResponse({
  description: "Internal server error",
  type: InternalServerErrorDto,
})
@Controller("employees")
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @ApiResponse({
    description: "List of employees",
    type: [PublicEmployeeResponseDto],
  })
  @Get()
  async findAll(): Promise<PublicEmployeeResponseDto[]> {
    return await this.employeesService.findAll();
  }

  @ApiOkAndNotFoundResponse({
    typeOkResponse: PublicEmployeeResponseDto,
    descriptionOkResponse: "Employee details by ID",
  })
  @Get(":id")
  async findById(@Param("id") id: string): Promise<PublicEmployeeResponseDto> {
    return await this.employeesService.findById(id);
  }

  @ApiOkAndBadRequestResponse({
    typeOkResponse: PublicEmployeeResponseDto,
    descriptionOkResponse: "Create a new employee",
  })
  @Post()
  async create(
    @Body() createEmployeeRequestDto: CreateEmployeeRequestDto,
  ): Promise<PublicEmployeeResponseDto> {
    return await this.employeesService.create(createEmployeeRequestDto);
  }

  @ApiOkAndBadRequestAndNotFoundResponse({
    typeOkResponse: PublicEmployeeResponseDto,
    descriptionOkResponse: "Update employee details by ID",
  })
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateEmployeeRequestDto: UpdateEmployeeRequestDto,
  ): Promise<PublicEmployeeResponseDto> {
    return await this.employeesService.update(id, updateEmployeeRequestDto);
  }

  @ApiOkAndNotFoundResponse({
    typeOkResponse: PublicEmployeeResponseDto,
    descriptionOkResponse: "Employee details by ID",
  })
  @Delete(":id")
  async delete(@Param("id") id: string): Promise<PublicEmployeeResponseDto> {
    return await this.employeesService.delete(id);
  }
}
