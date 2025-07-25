import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { Document } from "src/documents/schemas/document.schema";
import { Employee } from "src/employees/schemas/employee.schema";

@Injectable()
export class TempService {
  constructor(
    @InjectModel(Document.name) private readonly documentModel: Model<Document>,
    @InjectModel(Employee.name) private readonly employeeModel: Model<Employee>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async getTemporary(param: number): Promise<any> {
    const session = await this.connection.startSession();

    session.startTransaction();
    try {
      const createEmployee = new this.employeeModel({
        name: "Temporary Employee",
        cpf: "12345678901",
      });

      await createEmployee.save({ session });

      if (param > 2) {
        throw new BadRequestException(
          "This endpoint is temporary and only accepts param values less than or equal to 2.",
        );
      }

      // Simulate some processing logic
      const createDocument = new this.documentModel({
        employee: createEmployee._id,
        documentType: createEmployee._id,
        status: "missing",
      });

      await createDocument.save({ session });

      await session.commitTransaction();

      return {
        message: "Temporary endpoint response",
        paramValue: param,
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
