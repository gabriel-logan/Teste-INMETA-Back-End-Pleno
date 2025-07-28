import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { cacheKeys } from "src/common/constants";

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

  private async invalidateContractEventCache(
    id: string,
    cpf: string,
  ): Promise<void> {
    await this.cacheManager.del(cacheKeys.contractEvents.findAll);
    await this.cacheManager.del(cacheKeys.contractEvents.findById(id));
    await this.cacheManager.del(
      cacheKeys.contractEvents.findAllByEmployeeCpf(cpf),
    );
  }

  private async getOrSetCache<T>(
    key: string,
    fetchCbFn: () => Promise<T>,
  ): Promise<T> {
    const cached = await this.cacheManager.get<T>(key);

    if (cached) {
      return cached;
    }

    const data = await fetchCbFn();

    await this.cacheManager.set(key, data);

    return data;
  }

  async findAll(): Promise<ContractEvent[]> {
    return await this.getOrSetCache(
      cacheKeys.contractEvents.findAll,
      async () => await this.contractEventModel.find().lean(),
    );
  }

  async findById(id: string): Promise<ContractEvent> {
    return await this.getOrSetCache(
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
    return await this.getOrSetCache(
      cacheKeys.contractEvents.findAllByEmployeeCpf(employeeCpf),
      async () => await this.contractEventModel.find({ employeeCpf }).lean(),
    );
  }

  async findManyByIds(
    ids: string[] | Types.ObjectId[],
  ): Promise<ContractEvent[]> {
    return await this.contractEventModel.find({ _id: { $in: ids } }).lean();
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
      employeeCpf,
    });

    const newContractEvent = await createdContractEvent.save();

    // Invalidate cache for findAll, findById, and findAllByEmployeeCpf
    await this.invalidateContractEventCache(
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

    const updatedContractEvent = await this.contractEventModel
      .findByIdAndUpdate(
        id,
        {
          type,
          date,
          reason,
          employeeFullName,
          employeeCpf,
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .lean();

    if (!updatedContractEvent) {
      throw new NotFoundException(`ContractEvent with id ${id} not found`);
    }

    // Invalidate cache for findById and findAll, findAllByEmployeeCpf
    await this.invalidateContractEventCache(
      updatedContractEvent._id.toString(),
      updatedContractEvent.employeeCpf,
    );
    // In case the employeeCpf has changed, invalidate the old cache
    await this.cacheManager.del(
      cacheKeys.contractEvents.findAllByEmployeeCpf(employeeCpf),
    );

    // Set cache for the updated contract event
    await this.cacheManager.set(
      cacheKeys.contractEvents.findById(id),
      updatedContractEvent,
    );

    return updatedContractEvent;
  }
}
