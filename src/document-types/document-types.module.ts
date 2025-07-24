import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { DocumentTypesController } from "./controllers/document-types.controller";
import { DocumentTypesService } from "./providers/document-types.service";
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
  controllers: [DocumentTypesController],
  providers: [DocumentTypesService],
  exports: [DocumentTypesService],
})
export class DocumentTypesModule {}
