import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DocumentTypesModule } from "src/document-types/document-types.module";
import { DocumentsModule } from "src/documents/documents.module";

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
    DocumentTypesModule,
    forwardRef(() => DocumentsModule),
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
