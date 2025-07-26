import { Injectable } from "@nestjs/common";

@Injectable()
export class ContractEventsService {
  create(createContractEventDto: CreateContractEventDto) {
    return "This action adds a new contractEvent";
  }

  findAll() {
    return `This action returns all contractEvents`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contractEvent`;
  }

  update(id: number, updateContractEventDto: UpdateContractEventDto) {
    return `This action updates a #${id} contractEvent`;
  }

  remove(id: number) {
    return `This action removes a #${id} contractEvent`;
  }
}
