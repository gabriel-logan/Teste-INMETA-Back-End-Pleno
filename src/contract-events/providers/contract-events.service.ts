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

  async findAll(): Promise<ContractEvent[]> {
    const cachedContractEvents = await this.cacheManager.get<ContractEvent[]>(
      cacheKeys.contractEvents.findAll,
    );

    if (cachedContractEvents) {
      return cachedContractEvents;
    }

    const contractEvents = await this.contractEventModel.find().lean();

    await this.cacheManager.set(
      cacheKeys.contractEvents.findAll,
      contractEvents,
    );

    return contractEvents;
  }

  async findById(id: string): Promise<ContractEvent> {
    const cachedContractEvent = await this.cacheManager.get<ContractEvent>(
      cacheKeys.contractEvents.findById(id),
    );

    if (cachedContractEvent) {
      return cachedContractEvent;
    }

    const contractEvent = await this.contractEventModel.findById(id).lean();

    if (!contractEvent) {
      throw new NotFoundException(`ContractEvent with id ${id} not found`);
    }

    await this.cacheManager.set(
      cacheKeys.contractEvents.findById(id),
      contractEvent,
    );

    return contractEvent;
  }

  async findManyByIds(
    ids: string[] | Types.ObjectId[],
  ): Promise<ContractEvent[]> {
    const contractEvents = await this.contractEventModel
      .find({ _id: { $in: ids } })
      .lean();

    return contractEvents;
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

    // Invalidate cache for findAll
    await this.cacheManager.del(cacheKeys.contractEvents.findAll);

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

    // Invalidate cache for findById and findAll
    await this.cacheManager.del(cacheKeys.contractEvents.findById(id));
    await this.cacheManager.del(cacheKeys.contractEvents.findAll);

    // Set cache for the updated contract event
    await this.cacheManager.set(
      cacheKeys.contractEvents.findById(id),
      updatedContractEvent,
    );

    return updatedContractEvent;
  }
}
