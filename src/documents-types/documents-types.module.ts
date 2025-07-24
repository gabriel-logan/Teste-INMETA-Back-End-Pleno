import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { DocumentsTypesController } from "./controllers/documents-types.controller";
import { DocumentsTypesService } from "./providers/documents-types.service";
import {
  DocumentsType,
  DocumentsTypeSchema,
} from "./schemas/documents-type.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DocumentsType.name,
        schema: DocumentsTypeSchema,
      },
    ]),
  ],
  controllers: [DocumentsTypesController],
  providers: [DocumentsTypesService],
})
export class DocumentsTypesModule {}
