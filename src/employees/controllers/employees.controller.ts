import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import {
  ApiGlobalErrorResponses,
  ApiStandardResponses,
} from "src/common/decorators/routes/docs";

import {
  FireEmployeeRequestDto,
  HireAgainEmployeeRequestDto,
} from "../dto/request/action-reason-employee.dto";
import { CreateEmployeeRequestDto } from "../dto/request/create-employee.dto";
import { LinkDocumentTypesDto } from "../dto/request/link-document-types.dto";
import { UpdateEmployeeRequestDto } from "../dto/request/update-employee.dto";
import {
  FireEmployeeResponseDto,
  HireAgainEmployeeResponseDto,
} from "../dto/response/action-reason-employee.dto";
import { DocumentTypeEmployeeLinkedResponseDto } from "../dto/response/documentType-employee-linked.dto";
import { DocumentTypeEmployeeUnlinkedResponseDto } from "../dto/response/documentType-employee-unlinked.dto";
import { PublicEmployeeResponseDto } from "../dto/response/public-employee.dto";
import { EmployeesService } from "../providers/employees.service";

@ApiGlobalErrorResponses()
@Controller("employees")
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @ApiStandardResponses({
    ok: {
      description: "List of all employees",
      type: PublicEmployeeResponseDto,
      isArray: true,
    },
  })
  @Get()
  async findAll(): Promise<PublicEmployeeResponseDto[]> {
    return await this.employeesService.findAll();
  }

  @ApiStandardResponses({
    ok: {
      description: "Employee details by ID",
      type: PublicEmployeeResponseDto,
    },
    notFound: true,
  })
  @Get(":employeeId")
  async findById(
    @Param("employeeId", ParseObjectIdPipe) employeeId: string,
  ): Promise<PublicEmployeeResponseDto> {
    return await this.employeesService.findById(employeeId);
  }

  @ApiStandardResponses({
    ok: {
      description: "Employee details with contract events",
      type: PublicEmployeeResponseDto,
    },
    notFound: true,
  })
  @Get(":employeeId/contract-events")
  async findByIdWithContractEvents(
    @Param("employeeId", ParseObjectIdPipe) employeeId: string,
  ): Promise<PublicEmployeeResponseDto> {
    return await this.employeesService.findByIdWithContractEvents(employeeId);
  }

  @ApiStandardResponses({
    ok: {
      description: "Create a new employee",
      type: PublicEmployeeResponseDto,
      statusCode: HttpStatus.CREATED,
    },
    badRequest: true,
  })
  @Post()
  async create(
    @Body() createEmployeeDto: CreateEmployeeRequestDto,
  ): Promise<PublicEmployeeResponseDto> {
    return await this.employeesService.create(createEmployeeDto);
  }

  @ApiStandardResponses({
    ok: {
      description: "Update employee details",
      type: PublicEmployeeResponseDto,
    },
    notFound: true,
    badRequest: true,
  })
  @Patch(":employeeId")
  async update(
    @Param("employeeId", ParseObjectIdPipe) employeeId: string,
    @Body() updateEmployeeDto: UpdateEmployeeRequestDto,
  ): Promise<PublicEmployeeResponseDto> {
    return await this.employeesService.update(employeeId, updateEmployeeDto);
  }

  @ApiStandardResponses({
    ok: {
      description: "Fire an employee",
      type: FireEmployeeRequestDto,
    },
    notFound: true,
    badRequest: true,
  })
  @Post("fire/:employeeId")
  async fire(
    @Param("employeeId", ParseObjectIdPipe) employeeId: string,
    @Body() fireEmployeeDto: FireEmployeeRequestDto,
  ): Promise<FireEmployeeResponseDto> {
    return await this.employeesService.fire(employeeId, fireEmployeeDto);
  }

  @ApiStandardResponses({
    ok: {
      description: "Rehire an employee",
      type: HireAgainEmployeeResponseDto,
    },
    notFound: true,
    badRequest: true,
  })
  @Post("hire-again/:employeeId")
  async hireAgain(
    @Param("employeeId", ParseObjectIdPipe) employeeId: string,
    @Body() hireAgainEmployeeDto: HireAgainEmployeeRequestDto,
  ): Promise<HireAgainEmployeeResponseDto> {
    return await this.employeesService.hireAgain(
      employeeId,
      hireAgainEmployeeDto,
    );
  }

  @ApiStandardResponses({
    ok: {
      description: "Link document types to an employee",
      type: DocumentTypeEmployeeLinkedResponseDto,
    },
    notFound: true,
  })
  @Post(":employeeId/document-types/link")
  async linkDocumentTypes(
    @Param("employeeId", ParseObjectIdPipe) employeeId: string,
    @Body() linkDocumentTypesDto: LinkDocumentTypesDto,
  ): Promise<DocumentTypeEmployeeLinkedResponseDto> {
    return await this.employeesService.linkDocumentTypes(
      employeeId,
      linkDocumentTypesDto,
    );
  }

  @ApiStandardResponses({
    ok: {
      description: "Unlink document types from an employee",
      type: DocumentTypeEmployeeUnlinkedResponseDto,
    },
    notFound: true,
  })
  @Post(":employeeId/document-types/unlink")
  async unlinkDocumentTypes(
    @Param("employeeId", ParseObjectIdPipe) employeeId: string,
    @Body() unlinkDocumentTypesDto: LinkDocumentTypesDto,
  ): Promise<DocumentTypeEmployeeUnlinkedResponseDto> {
    return await this.employeesService.unlinkDocumentTypes(
      employeeId,
      unlinkDocumentTypesDto,
    );
  }
}
