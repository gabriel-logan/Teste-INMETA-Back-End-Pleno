import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { cacheKeys } from "src/common/constants";
import getAndSetCache from "src/common/utils/get-and-set.cache";

import { CreateContractEventRequestDto } from "../dto/request/create-contract-event.dto";
import { UpdateContractEventRequestDto } from "../dto/request/update-contract-event.dto";
import {
  ContractEvent,
  ContractEventDocument,
} from "../schemas/contract-event.schema";

@Injectable()
export class ContractEventsService {
  constructor(
    @InjectModel(ContractEvent.name)
    private readonly contractEventModel: Model<ContractEvent>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  private async invalidateContractEventCacheById(id: string): Promise<void> {
    await this.cacheManager.del(cacheKeys.contractEvents.findById(id));
  }

  private async invalidateContractEventCacheByCpf(cpf: string): Promise<void> {
    await this.cacheManager.del(
      cacheKeys.contractEvents.findAllByEmployeeCpf(cpf),
    );
  }

  private async invalidateAllContractEventCache(
    id: string,
    cpf: string,
  ): Promise<void> {
    await Promise.all([
      this.cacheManager.del(cacheKeys.contractEvents.findAll),
      this.invalidateContractEventCacheById(id),
      this.invalidateContractEventCacheByCpf(cpf),
    ]);
  }

  private parseEmployeeCpf(cpf: string): string {
    return cpf.replace(/\D/g, ""); // Remove non-numeric characters
  }

  async findAll(): Promise<ContractEvent[]> {
    return await getAndSetCache(
      this.cacheManager,
      cacheKeys.contractEvents.findAll,
      async () => await this.contractEventModel.find().lean(),
    );
  }

  async findById(id: string): Promise<ContractEvent> {
    return await getAndSetCache(
      this.cacheManager,
      cacheKeys.contractEvents.findById(id),
      async () => {
        const contractEvent = await this.contractEventModel.findById(id).lean();

        if (!contractEvent) {
          throw new NotFoundException(`ContractEvent with id ${id} not found`);
        }

        return contractEvent;
      },
    );
  }

  async findAllByEmployeeCpf(employeeCpf: string): Promise<ContractEvent[]> {
    return await getAndSetCache(
      this.cacheManager,
      cacheKeys.contractEvents.findAllByEmployeeCpf(employeeCpf),
      async () => await this.contractEventModel.find({ employeeCpf }).lean(),
    );
  }

  async findManyByIds(
    ids: string[] | Types.ObjectId[],
  ): Promise<ContractEvent[]> {
    const idsSet = new Set(ids.map((id) => id.toString()));

    if (idsSet.size === 0) {
      return [];
    }

    return await getAndSetCache(
      this.cacheManager,
      cacheKeys.contractEvents.findManyByIds([...idsSet]),
      async () => {
        return await this.contractEventModel.find({ _id: { $in: ids } }).lean();
      },
    );
  }

  async create(
    createContractEventDto: CreateContractEventRequestDto,
  ): Promise<ContractEventDocument> {
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

    // Invalidate cache for findAll, findById, and findAllByEmployeeCpf
    await this.invalidateAllContractEventCache(
      newContractEvent._id.toString(),
      newContractEvent.employeeCpf,
    );

    // Set cache for the newly created contract event
    await this.cacheManager.set(
      cacheKeys.contractEvents.findById(newContractEvent._id.toString()),
      newContractEvent,
    );

    return newContractEvent;
  }

  async update(
    id: string,
    updateContractEventDto: UpdateContractEventRequestDto,
  ): Promise<ContractEvent> {
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

    // Invalidate cache for findById and findAll, findAllByEmployeeCpf
    await this.invalidateAllContractEventCache(
      updatedContractEvent._id.toString(),
      updatedContractEvent.employeeCpf,
    );
    // In case the employeeCpf has changed, invalidate the old cache
    if (previousEmployeeCpf !== updatedContractEvent.employeeCpf) {
      await this.invalidateContractEventCacheByCpf(previousEmployeeCpf);
    }

    // Set cache for the updated contract event
    await this.cacheManager.set(
      cacheKeys.contractEvents.findById(id),
      updatedContractEvent,
    );

    return updatedContractEvent;
  }
}
