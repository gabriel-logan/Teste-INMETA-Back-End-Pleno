import { Module, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { InjectConnection, MongooseModule } from "@nestjs/mongoose";
import mongoose, { Connection } from "mongoose";

import { AppController } from "./app.controller";
import envDatabase from "./configs/env.database";
import envGlobal from "./configs/env.global";
import { MongooseProvider } from "./configs/mongoose-provider";
import { DocumentTypesModule } from "./document-types/document-types.module";
import { DocumentsModule } from "./documents/documents.module";
import { EmployeesModule } from "./employees/employees.module";
import { EmployeeDocumentModule } from "./shared/employee-document/employee-document.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envGlobal],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forFeature(envDatabase)],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("database.mongodb.uri"),
      }),
      inject: [ConfigService],
    }),
    EmployeeDocumentModule,
    EmployeesModule,
    DocumentsModule,
    DocumentTypesModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements OnModuleInit, OnModuleDestroy {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  onModuleInit(): void {
    // Enable transaction support for Mongoose
    mongoose.set("transactionAsyncLocalStorage", true);

    MongooseProvider.setMongooseInstance(this.connection);
  }

  onModuleDestroy(): void {
    MongooseProvider.clearMongooseInstance();
  }
}
