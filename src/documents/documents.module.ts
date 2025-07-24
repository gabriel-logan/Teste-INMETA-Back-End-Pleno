import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { DocumentsController } from "./controllers/documents.controller";
import { DocumentsService } from "./providers/documents.service";
import { Document, DocumentSchema } from "./schemas/document.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Document.name,
        schema: DocumentSchema,
      },
    ]),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
