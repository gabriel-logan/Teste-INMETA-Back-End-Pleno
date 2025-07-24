import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { AppController } from "./app.controller";
import envDatabase from "./configs/env.database";
import envGlobal from "./configs/env.global";

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
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
