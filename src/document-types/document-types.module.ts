import { Module } from "@nestjs/common";

import { DocumentTypesController } from "./controllers/document-types.controller";
import { DocumentTypesService } from "./providers/document-types.service";

@Module({
  controllers: [DocumentTypesController],
  providers: [DocumentTypesService],
})
export class DocumentTypesModule {}
