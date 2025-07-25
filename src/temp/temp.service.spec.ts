import { getModelToken } from "@nestjs/mongoose";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { Connection } from "mongoose";
import { MongooseProvider } from "src/configs/mongoose-provider";
import { Document } from "src/documents/schemas/document.schema";
import { Employee } from "src/employees/schemas/employee.schema";

import { TempService } from "./temp.service";

describe("TempService", () => {
  let service: TempService;

  const mockEmployeeModel = class extends Employee {
    public _id = "fakeEmployeeId";
    public save: jest.Mock = jest.fn().mockResolvedValue(this);
  };

  const mockDocumentModel = class extends Document {
    public _id = "fakeDocumentId";
    public save: jest.Mock = jest.fn().mockResolvedValue(this);
  };

  const mockSession = {
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    endSession: jest.fn(),
  };

  const mockConnection = {
    startSession: jest.fn().mockResolvedValue(mockSession),
  };

  beforeEach(async () => {
    // Mock the Mongoose connection
    MongooseProvider.setMongooseInstance(
      mockConnection as unknown as Connection,
    );

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        TempService,
        {
          provide: getModelToken(Employee.name),
          useValue: mockEmployeeModel,
        },
        {
          provide: getModelToken(Document.name),
          useValue: mockDocumentModel,
        },
      ],
    }).compile();

    service = module.get<TempService>(TempService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should commit transaction when param <= 2", async () => {
    await service.getTemporary(1);

    expect(mockConnection.startSession).toHaveBeenCalled();
    expect(mockSession.startTransaction).toHaveBeenCalled();
    expect(mockSession.commitTransaction).toHaveBeenCalled();
    expect(mockSession.abortTransaction).not.toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });

  it("should abort transaction when param > 2", async () => {
    await expect(service.getTemporary(3)).rejects.toThrow();

    expect(mockConnection.startSession).toHaveBeenCalled();
    expect(mockSession.startTransaction).toHaveBeenCalled();
    expect(mockSession.abortTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });
});
