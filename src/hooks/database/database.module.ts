import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import mongooseAutopopulatePlugin from "mongoose-autopopulate";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("mongodb.uri"),
        auth: {
          username: configService.get<string>("mongodb.user"),
          password: configService.get<string>("mongodb.password"),
        },
        authSource: configService.get<string>("mongodb.authenSource"),
        connectionFactory: (connection) => {
          connection.plugin(mongooseAutopopulatePlugin);
          return connection;
        },
        useCreateIndex: true,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class DatabaseModule {}
