import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { ApiSecurity } from "@nestjs/swagger";
import {
  ApiGetAllEmployeesQueries,
  ApiGlobalErrorResponses,
  ApiStandardResponses,
} from "src/common/decorators/routes/docs.decorator";
import { EmployeeFromReq } from "src/common/decorators/routes/employee.decorator";
import { Public } from "src/common/decorators/routes/public.decorator";
import { Roles } from "src/common/decorators/routes/roles.decorator";
import {
  EmployeeFullResponseDto,
  EmployeeWithContractEventsResponseDto,
  EmployeeWithDocumentTypesResponseDto,
} from "src/common/dto/response/employee.dto";
import { ParseCpfPipe } from "src/common/pipes/parse-cpf.pipe";
import { ParseObjectIdPipeLocal } from "src/common/pipes/parse-objectId-local.pipe";
import { AuthPayload } from "src/common/types";

import {
  FireEmployeeRequestDto,
  ReHireEmployeeRequestDto,
} from "../dto/request/action-reason-employee.dto";
import { CreateAdminEmployeeRequestDto } from "../dto/request/create-admin-employee.dto";
import { CreateEmployeeRequestDto } from "../dto/request/create-employee.dto";
import { LinkDocumentTypesRequestDto } from "../dto/request/link-document-types.dto";
import { UpdateEmployeeRequestDto } from "../dto/request/update-employee.dto";
import {
  FireEmployeeResponseDto,
  ReHireEmployeeResponseDto,
} from "../dto/response/action-reason-employee.dto";
import { CreateAdminEmployeeResponseDto } from "../dto/response/create-admin-employee.dto";
import { DocumentTypeEmployeeLinkedResponseDto } from "../dto/response/documentType-employee-linked.dto";
import { DocumentTypeEmployeeUnlinkedResponseDto } from "../dto/response/documentType-employee-unlinked.dto";
import { EmployeesService } from "../providers/employees.service";
import { ContractStatus, EmployeeRole } from "../schemas/employee.schema";

@ApiGlobalErrorResponses()
@Controller("employees")
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @ApiSecurity("bearer")
  @Roles(EmployeeRole.MANAGER, EmployeeRole.ADMIN)
  @ApiStandardResponses({
    ok: {
      description: "List of all employees",
      type: EmployeeWithDocumentTypesResponseDto,
      isArray: true,
    },
  })
  @ApiGetAllEmployeesQueries()
  @Get()
  async findAll(
    @Query("byFirstName") byFirstName?: string,
    @Query("byLastName") byLastName?: string,
    @Query("byContractStatus") byContractStatus?: ContractStatus,
    @Query("byDocumentTypeId", new ParseObjectIdPipeLocal({ optional: true }))
    byDocumentTypeId?: string,
    @Query("byCpf", new ParseCpfPipe({ optional: true })) byCpf?: string,
  ): Promise<EmployeeWithDocumentTypesResponseDto[]> {
    return await this.employeesService.findAll({
      byFirstName,
      byLastName,
      byContractStatus,
      byDocumentTypeId,
      byCpf,
    });
  }

  @ApiSecurity("bearer")
  @Roles(EmployeeRole.MANAGER, EmployeeRole.ADMIN)
  @ApiStandardResponses({
    ok: {
      description: "Employee details by ID",
      type: EmployeeWithDocumentTypesResponseDto,
    },
    notFound: true,
  })
  @Get(":employeeId")
  async findById(
    @Param("employeeId", ParseObjectIdPipe) employeeId: string,
  ): Promise<EmployeeWithDocumentTypesResponseDto> {
    return await this.employeesService.findById(employeeId);
  }

  @ApiSecurity("bearer")
  @Roles(EmployeeRole.MANAGER, EmployeeRole.ADMIN)
  @ApiStandardResponses({
    ok: {
      description: "Employee details with contract events",
      type: EmployeeWithContractEventsResponseDto,
    },
    notFound: true,
  })
  @Get(":employeeId/contract-events")
  async findByIdWithContractEvents(
    @Param("employeeId", ParseObjectIdPipe) employeeId: string,
  ): Promise<EmployeeWithContractEventsResponseDto> {
    return await this.employeesService.findByIdWithContractEvents(employeeId);
  }

  @ApiSecurity("bearer")
  @Roles(EmployeeRole.MANAGER, EmployeeRole.ADMIN)
  @ApiStandardResponses({
    ok: {
      description: "Create a new employee",
      type: EmployeeFullResponseDto,
      isStatusCodeCreated: true,
    },
    badRequest: true,
    conflict: true,
  })
  @Post()
  async create(
    @Body() createEmployeeDto: CreateEmployeeRequestDto,
  ): Promise<EmployeeFullResponseDto> {
    return await this.employeesService.create(createEmployeeDto);
  }

  @ApiSecurity("bearer")
  @Roles(EmployeeRole.MANAGER, EmployeeRole.ADMIN)
  @ApiStandardResponses({
    ok: {
      description: "Update employee details",
      type: EmployeeWithDocumentTypesResponseDto,
    },
    notFound: true,
    badRequest: true,
    conflict: true,
  })
  @Patch(":employeeId")
  async update(
    @Param("employeeId", ParseObjectIdPipe) employeeId: string,
    @Body() updateEmployeeDto: UpdateEmployeeRequestDto,
  ): Promise<EmployeeWithDocumentTypesResponseDto> {
    return await this.employeesService.update(employeeId, updateEmployeeDto);
  }

  @ApiSecurity("bearer")
  @Roles(EmployeeRole.MANAGER, EmployeeRole.ADMIN)
  @ApiStandardResponses({
    ok: {
      description: "Fire an employee",
      type: FireEmployeeResponseDto,
    },
    notFound: true,
    badRequest: true,
  })
  @HttpCode(HttpStatus.OK)
  @Post("fire/:employeeId")
  async fire(
    @Param("employeeId", ParseObjectIdPipe) employeeId: string,
    @Body() fireEmployeeDto: FireEmployeeRequestDto,
    @EmployeeFromReq() employeeFromReq: AuthPayload,
  ): Promise<FireEmployeeResponseDto> {
    return await this.employeesService.fire(
      employeeId,
      fireEmployeeDto,
      employeeFromReq,
    );
  }

  @ApiSecurity("bearer")
  @Roles(EmployeeRole.MANAGER, EmployeeRole.ADMIN)
  @ApiStandardResponses({
    ok: {
      description: "Rehire an employee",
      type: ReHireEmployeeResponseDto,
    },
    notFound: true,
    badRequest: true,
  })
  @HttpCode(HttpStatus.OK)
  @Post("rehire/:employeeId")
  async reHire(
    @Param("employeeId", ParseObjectIdPipe) employeeId: string,
    @Body() reHireEmployeeDto: ReHireEmployeeRequestDto,
    @EmployeeFromReq() employeeFromReq: AuthPayload,
  ): Promise<ReHireEmployeeResponseDto> {
    return await this.employeesService.reHire(
      employeeId,
      reHireEmployeeDto,
      employeeFromReq,
    );
  }

  @ApiSecurity("bearer")
  @Roles(EmployeeRole.MANAGER, EmployeeRole.ADMIN)
  @ApiStandardResponses({
    ok: {
      description: "Link document types to an employee",
      type: DocumentTypeEmployeeLinkedResponseDto,
    },
    notFound: true,
    badRequest: true,
  })
  @HttpCode(HttpStatus.OK)
  @Post(":employeeId/document-types/link")
  async linkDocumentTypes(
    @Param("employeeId", ParseObjectIdPipe) employeeId: string,
    @Body() linkDocumentTypesDto: LinkDocumentTypesRequestDto,
  ): Promise<DocumentTypeEmployeeLinkedResponseDto> {
    return await this.employeesService.linkDocumentTypes(
      employeeId,
      linkDocumentTypesDto,
    );
  }

  @ApiSecurity("bearer")
  @Roles(EmployeeRole.MANAGER, EmployeeRole.ADMIN)
  @ApiStandardResponses({
    ok: {
      description: "Unlink document types from an employee",
      type: DocumentTypeEmployeeUnlinkedResponseDto,
    },
    notFound: true,
    badRequest: true,
  })
  @HttpCode(HttpStatus.OK)
  @Post(":employeeId/document-types/unlink")
  async unlinkDocumentTypes(
    @Param("employeeId", ParseObjectIdPipe) employeeId: string,
    @Body() unlinkDocumentTypesDto: LinkDocumentTypesRequestDto,
  ): Promise<DocumentTypeEmployeeUnlinkedResponseDto> {
    return await this.employeesService.unlinkDocumentTypes(
      employeeId,
      unlinkDocumentTypesDto,
    );
  }

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
  @Post("admin")
  async createAdminEmployee(
    @Body() createAdminEmployeeDto: CreateAdminEmployeeRequestDto,
  ): Promise<CreateAdminEmployeeResponseDto> {
    return await this.employeesService.createAdminEmployee(
      createAdminEmployeeDto,
    );
  }
}
