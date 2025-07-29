import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ContractEventsModule } from "src/contract-events/contract-events.module";
import { DocumentTypesModule } from "src/document-types/document-types.module";
import { EmployeeDocumentModule } from "src/shared/employee-document/employee-document.module";

import { EmployeesController } from "./controllers/employees.controller";
import { AdminEmployeesService } from "./providers/admin-employees.service";
import { DocumentTypeLinkersService } from "./providers/document-type-linkers.service";
import { EmployeesService } from "./providers/employees.service";
import { HumanResourcesService } from "./providers/human-resources.service";
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
  providers: [
    EmployeesService,
    HumanResourcesService,
    AdminEmployeesService,
    DocumentTypeLinkersService,
  ],
  exports: [EmployeesService],
})
export class EmployeesModule {}
