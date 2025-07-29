import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { cacheKeys } from "src/common/constants";
import { ContractEventResponseDto } from "src/common/dto/response/contract-event.dto";
import { invalidateKeys, setMultipleKeys } from "src/common/utils/cache-utils";
import getAndSetCache from "src/common/utils/get-and-set.cache";

import { CreateContractEventRequestDto } from "../dto/request/create-contract-event.dto";
import { UpdateContractEventRequestDto } from "../dto/request/update-contract-event.dto";
import { ContractEvent } from "../schemas/contract-event.schema";

@Injectable()
export class ContractEventsService {
  constructor(
    @InjectModel(ContractEvent.name)
    private readonly contractEventModel: Model<ContractEvent>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  private parseEmployeeCpf(cpf: string): string {
    return cpf.replace(/\D/g, ""); // Remove non-numeric characters
  }

  private genericResponseMapper(
    contractEvent: ContractEvent,
  ): ContractEventResponseDto {
    return {
      _id: contractEvent._id,
      id: contractEvent._id.toString(),
      type: contractEvent.type,
      date: contractEvent.date,
      reason: contractEvent.reason,
      employeeFullName: contractEvent.employeeFullName,
      employeeCpf: contractEvent.employeeCpf,
      createdAt: contractEvent.createdAt,
      updatedAt: contractEvent.updatedAt,
    };
  }

  private async invalidateContractEventCaches(
    event: ContractEvent,
  ): Promise<void> {
    await invalidateKeys(this.cacheManager, [
      cacheKeys.contractEvents.findAll,
      cacheKeys.contractEvents.findById(event._id.toString()),
      cacheKeys.contractEvents.findAllByEmployeeCpf(event.employeeCpf),
      cacheKeys.contractEvents.findManyByIds([event._id.toString()]),
    ]);
  }

  private async setContractEventCaches(event: ContractEvent): Promise<void> {
    await setMultipleKeys(this.cacheManager, event, [
      cacheKeys.contractEvents.findById(event._id.toString()),
      cacheKeys.contractEvents.findManyByIds([event._id.toString()]),
    ]);
  }

  async findAll(): Promise<ContractEventResponseDto[]> {
    return await getAndSetCache(
      this.cacheManager,
      cacheKeys.contractEvents.findAll,
      async () => {
        const contractEvents = await this.contractEventModel.find().lean();

        return contractEvents.map((event) => this.genericResponseMapper(event));
      },
    );
  }

  async findById(id: string): Promise<ContractEventResponseDto> {
    return await getAndSetCache(
      this.cacheManager,
      cacheKeys.contractEvents.findById(id),
      async () => {
        const contractEvent = await this.contractEventModel.findById(id).lean();

        if (!contractEvent) {
          throw new NotFoundException(`ContractEvent with id ${id} not found`);
        }

        return this.genericResponseMapper(contractEvent);
      },
    );
  }

  async findAllByEmployeeCpf(
    employeeCpf: string,
  ): Promise<ContractEventResponseDto[]> {
    const parsedCpf = this.parseEmployeeCpf(employeeCpf);

    return await getAndSetCache(
      this.cacheManager,
      cacheKeys.contractEvents.findAllByEmployeeCpf(parsedCpf),
      async () => {
        const contractEvents = await this.contractEventModel
          .find({ employeeCpf: parsedCpf })
          .lean();

        return contractEvents.map((event) => this.genericResponseMapper(event));
      },
    );
  }

  async findManyByIds(
    ids: string[] | Types.ObjectId[],
  ): Promise<ContractEventResponseDto[]> {
    const idsSet = new Set(ids.map((id) => id.toString()));

    if (idsSet.size === 0) {
      return [];
    }

    return await getAndSetCache(
      this.cacheManager,
      cacheKeys.contractEvents.findManyByIds(
        [...idsSet].sort((a, b) => a.localeCompare(b)),
      ),
      async () => {
        const contractEvents = await this.contractEventModel
          .find({ _id: { $in: ids } })
          .lean();

        return contractEvents.map((event) => this.genericResponseMapper(event));
      },
    );
  }

  async create(
    createContractEventDto: CreateContractEventRequestDto,
  ): Promise<ContractEventResponseDto> {
    const { type, date, reason, employeeFullName, employeeCpf } =
      createContractEventDto;

    const createdContractEvent = new this.contractEventModel({
      type,
      date,
      reason,
      employeeFullName,
      employeeCpf: this.parseEmployeeCpf(employeeCpf),
    });

    const newContractEvent = await createdContractEvent.save();

    // Invalidate and set caches after creation
    await Promise.all([
      // Invalidate cache for findAll, findById, and findAllByEmployeeCpf
      this.invalidateContractEventCaches(newContractEvent),

      // Set cache for the newly created contract event
      this.setContractEventCaches(newContractEvent),
    ]);

    return this.genericResponseMapper(newContractEvent);
  }

  async update(
    id: string,
    updateContractEventDto: UpdateContractEventRequestDto,
  ): Promise<ContractEventResponseDto> {
    const { type, date, reason, employeeFullName, employeeCpf } =
      updateContractEventDto;

    const existingContractEvent = await this.contractEventModel.findById(id);

    if (!existingContractEvent) {
      throw new NotFoundException(`ContractEvent with id ${id} not found`);
    }

    existingContractEvent.type = type;
    existingContractEvent.date = date;
    existingContractEvent.reason = reason;
    existingContractEvent.employeeFullName = employeeFullName;

    const previousEmployeeCpf = existingContractEvent.employeeCpf;

    existingContractEvent.employeeCpf = this.parseEmployeeCpf(employeeCpf);

    const updatedContractEvent = await existingContractEvent.save();

    // Invalidate and set caches after update
    await Promise.all([
      // Invalidate cache for findById and findAll, findAllByEmployeeCpf
      this.invalidateContractEventCaches(existingContractEvent),
      invalidateKeys(this.cacheManager, [
        cacheKeys.contractEvents.findAllByEmployeeCpf(previousEmployeeCpf),
      ]),

      // Set cache for the updated contract event
      this.setContractEventCaches(updatedContractEvent),
    ]);

    return this.genericResponseMapper(updatedContractEvent);
  }
}
