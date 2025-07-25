import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Transactional } from "src/common/decorators/transaction/Transactional";
import { Document } from "src/documents/schemas/document.schema";
import { Employee } from "src/employees/schemas/employee.schema";

@Injectable()
export class TempService {
  constructor(
    @InjectModel(Document.name) private readonly documentModel: Model<Document>,
    @InjectModel(Employee.name) private readonly employeeModel: Model<Employee>,
  ) {}

  @Transactional()
  async getTemporary(param: number): Promise<any> {
    const createEmployee = new this.employeeModel({
      name: "Temporary Employee",
      cpf: "12345678901",
    });

    await createEmployee.save();

    if (param > 2) {
      throw new BadRequestException(
        "This endpoint is temporary and only accepts param values less than or equal to 2.",
      );
    }

    // Simulate some processing logic
    const createDocument = new this.documentModel({
      employee: createEmployee._id,
    });

    await createDocument.save();

    return {
      message: "Temporary endpoint response",
      paramValue: param,
    };
  }
}
