import { CacheModule } from "@nestjs/cache-manager";
import { Module, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { InjectConnection, MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import mongoose, { Connection } from "mongoose";

import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { cacheTtl } from "./common/constants";
import envDatabase from "./configs/env.database";
import envGlobal from "./configs/env.global";
import { MongooseProvider } from "./configs/mongoose-provider";
import throttlerModuleOptions from "./configs/throttler-module-options";
import { ContractEventsModule } from "./contract-events/contract-events.module";
import { DocumentTypesModule } from "./document-types/document-types.module";
import { DocumentsModule } from "./documents/documents.module";
import { EmployeesModule } from "./employees/employees.module";
import { EmployeeDocumentModule } from "./shared/employee-document/employee-document.module";
import { TasksModule } from "./tasks/tasks.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envGlobal],
    }),
    ThrottlerModule.forRoot(throttlerModuleOptions), // Using local storage, because of resources constraints
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forFeature(envDatabase)],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("database.mongodb.uri"),
      }),
      inject: [ConfigService],
    }),
    CacheModule.register({
      // Using local storage, because of resources constraints
      isGlobal: true,
      ttl: cacheTtl,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    EmployeeDocumentModule,
    EmployeesModule,
    DocumentsModule,
    DocumentTypesModule,
    ContractEventsModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
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
