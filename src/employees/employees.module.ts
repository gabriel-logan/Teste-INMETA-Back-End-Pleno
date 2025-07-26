import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DocumentTypesModule } from "src/document-types/document-types.module";
import {
  Document,
  DocumentSchema,
} from "src/documents/schemas/document.schema";

import { EmployeesController } from "./controllers/employees.controller";
import { EmployeesService } from "./providers/employees.service";
import { Employee, EmployeeSchema } from "./schemas/employee.schema";

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
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
