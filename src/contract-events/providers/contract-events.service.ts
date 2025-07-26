import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { CreateContractEventRequestDto } from "../dto/request/create-contract-event.dto";
import { UpdateContractEventRequestDto } from "../dto/request/update-contract-event.dto";
import { DeleteContractEventResponseDto } from "../dto/response/delete-contract-event.dto";
import {
  ContractEvent,
  ContractEventDocument,
} from "../schemas/contract-event.schema";

@Injectable()
export class ContractEventsService {
  constructor(
    @InjectModel(ContractEvent.name)
    private readonly contractEventModel: Model<ContractEvent>,
  ) {}

  async findAll(): Promise<ContractEvent[]> {
    return await this.contractEventModel.find().lean();
  }

  async findById(id: string): Promise<ContractEvent> {
    const contractEvent = await this.contractEventModel.findById(id).lean();

    if (!contractEvent) {
      throw new NotFoundException(`ContractEvent with id ${id} not found`);
    }

    return contractEvent;
  }

  async findManyByIds(
    ids: string[] | Types.ObjectId[],
  ): Promise<ContractEvent[]> {
    return await this.contractEventModel.find({ _id: { $in: ids } }).lean();
  }

  async create(
    createContractEventDto: CreateContractEventRequestDto,
  ): Promise<ContractEventDocument> {
    const { type, date, reason } = createContractEventDto;

    const createdContractEvent = new this.contractEventModel({
      type,
      date,
      reason,
    });

    return await createdContractEvent.save();
  }

  async update(
    id: string,
    updateContractEventDto: UpdateContractEventRequestDto,
  ): Promise<ContractEvent> {
    const { type, date, reason } = updateContractEventDto;

    const updatedContractEvent = await this.contractEventModel
      .findByIdAndUpdate(id, {
        type,
        date,
        reason,
      })
      .lean();

    if (!updatedContractEvent) {
      throw new NotFoundException(`ContractEvent with id ${id} not found`);
    }

    return updatedContractEvent;
  }

  async remove(id: string): Promise<DeleteContractEventResponseDto> {
    const deletedContractEvent = await this.contractEventModel
      .findByIdAndDelete(id)
      .lean();

    if (!deletedContractEvent) {
      throw new NotFoundException(`ContractEvent with id ${id} not found`);
    }

    return {
      id: deletedContractEvent._id,
      message: `ContractEvent with id ${id} has been deleted successfully`,
    };
  }
}
