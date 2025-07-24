import { Module } from "@nestjs/common";

import { DocumentsController } from "./controllers/documents.controller";
import { DocumentsService } from "./providers/documents.service";

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
