import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { EmployeesModule } from "src/employees/employees.module";

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
    EmployeesModule,
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
