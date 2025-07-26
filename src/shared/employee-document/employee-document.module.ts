import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  Document,
  DocumentSchema,
} from "src/documents/schemas/document.schema";
import {
  Employee,
  EmployeeSchema,
} from "src/employees/schemas/employee.schema";

import { EmployeeDocumentService } from "./employee-document.service";

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
  ],
  providers: [EmployeeDocumentService],
  exports: [EmployeeDocumentService],
})
export class EmployeeDocumentModule {}
