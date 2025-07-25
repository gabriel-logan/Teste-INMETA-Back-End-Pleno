import { Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { InjectConnection, MongooseModule } from "@nestjs/mongoose";
import { Connection } from "mongoose";

import { AppController } from "./app.controller";
import envDatabase from "./configs/env.database";
import envGlobal from "./configs/env.global";
import { MongooseProvider } from "./configs/mongoose-provider";
import { DocumentTypesModule } from "./document-types/document-types.module";
import { DocumentsModule } from "./documents/documents.module";
import { EmployeesModule } from "./employees/employees.module";
import { TempModule } from "./temp/temp.module";

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
    EmployeesModule,
    DocumentsModule,
    DocumentTypesModule,
    TempModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  onModuleInit(): void {
    MongooseProvider.setMongooseInstance(this.connection);
  }
}
