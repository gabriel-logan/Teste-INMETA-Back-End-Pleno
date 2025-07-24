import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { DocumentsTypesController } from "./controllers/documents-types.controller";
import { DocumentsTypesService } from "./providers/documents-types.service";
import {
  DocumentType,
  DocumentTypeSchema,
} from "./schemas/document-type.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DocumentType.name,
        schema: DocumentTypeSchema,
      },
    ]),
  ],
  controllers: [DocumentsTypesController],
  providers: [DocumentsTypesService],
})
export class DocumentsTypesModule {}
