import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ContractEventsModule } from "src/contract-events/contract-events.module";
import { DocumentTypesModule } from "src/document-types/document-types.module";
import { EmployeeDocumentModule } from "src/shared/employee-document/employee-document.module";

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
    ]),
    EmployeeDocumentModule,
    DocumentTypesModule,
    ContractEventsModule,
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
