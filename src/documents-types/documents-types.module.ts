import { Module } from "@nestjs/common";

import { DocumentsTypesController } from "./controllers/documents-types.controller";
import { DocumentsTypesService } from "./providers/documents-types.service";

@Module({
  controllers: [DocumentsTypesController],
  providers: [DocumentsTypesService],
})
export class DocumentsTypesModule {}
