import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { Types } from "mongoose";
import { Transactional } from "src/common/decorators/transaction/Transactional";
import { AuthPayload } from "src/common/types";
import { ContractEventsService } from "src/contract-events/providers/contract-events.service";
import {
  ContractEvent,
  ContractEventType,
} from "src/contract-events/schemas/contract-event.schema";

import {
  FireEmployeeRequestDto,
  ReHireEmployeeRequestDto,
} from "../dto/request/action-reason-employee.dto";
import {
  FireEmployeeResponseDto,
  ReHireEmployeeResponseDto,
} from "../dto/response/action-reason-employee.dto";
import { ContractStatus, EmployeeRole } from "../schemas/employee.schema";
import { EmployeesService } from "./employees.service";

@Injectable()
export class HumanResourcesService {
  private readonly logger = new Logger(HumanResourcesService.name);

  constructor(
    private readonly employeesService: EmployeesService,
    private readonly contractEventsService: ContractEventsService,
  ) {}

  private employeeIdIsSameAsFromReq(
    employeeId: Types.ObjectId,
    employeeFromReq: AuthPayload,
  ): boolean {
    return employeeFromReq.sub === employeeId.toString();
  }

  private async createContractEvent({
    type,
    reason,
    employee,
  }: {
    type: ContractEventType;
    reason: string;
    employee: { cpf: string; fullName: string };
  }): Promise<ContractEvent> {
    return await this.contractEventsService.create({
      type,
      date: new Date(),
      reason,
      employeeCpf: employee.cpf,
      employeeFullName: employee.fullName,
    });
  }

  @Transactional()
  async fire(
    employeeId: Types.ObjectId,
    fireEmployeeDto: FireEmployeeRequestDto,
    employeeFromReq: AuthPayload,
  ): Promise<FireEmployeeResponseDto> {
    const isSameId = this.employeeIdIsSameAsFromReq(
      employeeId,
      employeeFromReq,
    );

    if (isSameId) {
      throw new BadRequestException(
        "You cannot fire yourself. Please contact a manager.",
      );
    }

    if (employeeFromReq.role !== EmployeeRole.MANAGER) {
      // This is a placeholder for the actual role check
      // You can replace this with your actual role checking logic
      // For demonstration purposes, we are letting it pass
      this.logger.warn("Only managers can fire employees");
    }

    const employeeToFire = await this.employeesService.findById(employeeId, {
      populates: ["contractEvents"],
      lean: false,
    });

    if (employeeToFire.contractStatus === ContractStatus.INACTIVE) {
      throw new BadRequestException(
        `Employee with id ${employeeId.toString()} is already inactive`,
      );
    }

    const contractEvent = await this.contractEventsService.create({
      type: ContractEventType.FIRED,
      date: new Date(),
      reason: fireEmployeeDto.reason,
      employeeCpf: employeeToFire.cpf,
      employeeFullName: employeeToFire.fullName,
    });

    employeeToFire.contractStatus = ContractStatus.INACTIVE;
    employeeToFire.contractEvents.push(contractEvent);

    await employeeToFire.save();

    return {
      reason: fireEmployeeDto.reason,
      message: `Successfully terminated contract for employee with id ${employeeId.toString()}`,
    };
  }

  @Transactional()
  async reHire(
    employeeId: Types.ObjectId,
    reHireEmployeeDto: ReHireEmployeeRequestDto,
    employeeFromReq: AuthPayload,
  ): Promise<ReHireEmployeeResponseDto> {
    const isSameId = this.employeeIdIsSameAsFromReq(
      employeeId,
      employeeFromReq,
    );

    if (isSameId) {
      throw new BadRequestException(
        "You cannot rehire yourself. Please contact a manager.",
      );
    }

    if (employeeFromReq.role !== EmployeeRole.MANAGER) {
      // This is a placeholder for the actual role check
      // You can replace this with your actual role checking logic
      // For demonstration purposes, we are letting it pass
      this.logger.warn("Only managers can rehire employees");
    }

    const employee = await this.employeesService.findById(employeeId, {
      populates: ["contractEvents"],
      lean: false,
    });

    if (employee.contractStatus === ContractStatus.ACTIVE) {
      throw new BadRequestException(
        `Employee with id ${employeeId.toString()} is already active`,
      );
    }

    const contractEvent = await this.createContractEvent({
      type: ContractEventType.REHIRED,
      reason: reHireEmployeeDto.reason,
      employee,
    });

    employee.contractStatus = ContractStatus.ACTIVE;
    employee.contractEvents.push(contractEvent);

    await employee.save();

    return {
      reason: reHireEmployeeDto.reason,
      message: `Successfully rehired employee with id ${employeeId.toString()}`,
    };
  }
}
