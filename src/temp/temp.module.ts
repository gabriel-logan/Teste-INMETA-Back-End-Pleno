import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DocumentTypesModule } from "src/document-types/document-types.module";
import {
  Document,
  DocumentSchema,
} from "src/documents/schemas/document.schema";
import {
  Employee,
  EmployeeSchema,
} from "src/employees/schemas/employee.schema";

import { TempController } from "./temp.controller";
import { TempService } from "./temp.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Employee.name,
        schema: EmployeeSchema,
      },
      {
        name: Document.name,
        schema: DocumentSchema,
      },
    ]),
    DocumentTypesModule,
  ],
  controllers: [TempController],
  providers: [TempService],
})
export class TempModule {}
