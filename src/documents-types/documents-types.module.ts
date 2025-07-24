import { Module } from "@nestjs/common";

import { DocumentsTypesController } from "./documents-types.controller";
import { DocumentsTypesService } from "./documents-types.service";

@Module({
  controllers: [DocumentsTypesController],
  providers: [DocumentsTypesService],
})
export class DocumentsTypesModule {}
