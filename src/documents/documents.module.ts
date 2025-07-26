import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { DocumentTypesModule } from "src/document-types/document-types.module";
import { EmployeesModule } from "src/employees/employees.module";
import { EmployeeDocumentModule } from "src/shared/employee-document/employee-document.module";

import { DocumentsController } from "./controllers/documents.controller";
import { DocumentsService } from "./providers/documents.service";
import { Document, DocumentSchema } from "./schemas/document.schema";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Document.name,
        schema: DocumentSchema,
      },
    ]),
    EmployeeDocumentModule,
    DocumentTypesModule,
    EmployeesModule,
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
