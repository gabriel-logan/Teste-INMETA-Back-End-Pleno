import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { cacheKeys } from "src/common/constants";
import { invalidateKeys, setMultipleKeys } from "src/common/utils/cache-utils";
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
    const parsedCpf = this.parseEmployeeCpf(employeeCpf);

    return await getAndSetCache(
      this.cacheManager,
      cacheKeys.contractEvents.findAllByEmployeeCpf(parsedCpf),
      async () => {
        return await this.contractEventModel
          .find({ employeeCpf: parsedCpf })
          .lean();
      },
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
      cacheKeys.contractEvents.findManyByIds(
        [...idsSet].sort((a, b) => a.localeCompare(b)),
      ),
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
    await invalidateKeys(this.cacheManager, [
      cacheKeys.contractEvents.findAll,
      cacheKeys.contractEvents.findById(newContractEvent._id.toString()),
      cacheKeys.contractEvents.findAllByEmployeeCpf(
        newContractEvent.employeeCpf,
      ),
      cacheKeys.contractEvents.findManyByIds([newContractEvent._id.toString()]),
    ]);

    // Set cache for the newly created contract event
    await setMultipleKeys(this.cacheManager, newContractEvent, [
      cacheKeys.contractEvents.findById(newContractEvent._id.toString()),
      cacheKeys.contractEvents.findManyByIds([newContractEvent._id.toString()]),
    ]);

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
    await invalidateKeys(this.cacheManager, [
      cacheKeys.contractEvents.findById(id),
      cacheKeys.contractEvents.findAll,
      cacheKeys.contractEvents.findAllByEmployeeCpf(previousEmployeeCpf),
      cacheKeys.contractEvents.findManyByIds([id]),
    ]);

    // Set cache for the updated contract event
    await setMultipleKeys(this.cacheManager, updatedContractEvent, [
      cacheKeys.contractEvents.findById(updatedContractEvent._id.toString()),
      cacheKeys.contractEvents.findManyByIds([
        updatedContractEvent._id.toString(),
      ]),
    ]);

    return updatedContractEvent;
  }
}
