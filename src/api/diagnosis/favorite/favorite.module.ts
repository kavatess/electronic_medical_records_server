import { CacheModule, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FavoriteController } from "./controllers/favorite.controller";
import { FavoriteCustomController } from "./controllers/favorite.custom.controller";
import { FavoriteLinkedListController } from "./controllers/favorite.linked-list.controller";
import { FavoriteService } from "./favorite.service";
import { Favorite, FavoriteSchema } from "./schemas/favorite.schema";
import { FavoriteSubscriber } from "./favorite.subscriber";
import { RabbitBaseModule } from "src/hooks/rabbitmq/rabbit-base.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { CaslModule } from "src/auth/casl/casl.module";
import { UserModule } from "src/auth/user/user.module";
import { UserRoleModule } from "src/auth/user-role/user-role.module";
import { DiagnosisModule } from "../diagnosis/diagnosis.module";
import { localEmit } from "src/hooks/database/plugins/local-emit.plugin";
import { EventEmitter2, EventEmitterModule } from "@nestjs/event-emitter";
import { LoggerModule, PinoLogger } from "nestjs-pino";

export const TYPE_ENUM = [
  "variable",
  "user_filter",
  "conversation_search",
  "last_conversation",
  "diagnosis",
  "drug",
  "symptom",
  "ggsheet_report",
  "doctor_search",
];

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.get("auth"),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.get("cache"),
      inject: [ConfigService],
    }),
    CaslModule,
    RabbitBaseModule,
    UserModule,
    UserRoleModule,
    MongooseModule.forFeatureAsync([
      {
        imports: [EventEmitterModule, LoggerModule],
        name: Favorite.name,
        inject: [EventEmitter2, PinoLogger],
        useFactory: function (eventEmitter: EventEmitter2, logger: PinoLogger) {
          const schema = FavoriteSchema;
          schema.plugin(localEmit(eventEmitter, logger), {
            resource: "Favorite",
            populate: [],
          });
          return schema;
        },
      },
    ]),
    DiagnosisModule,
  ],
  controllers: [
    FavoriteController,
    FavoriteCustomController,
    FavoriteLinkedListController,
  ],
  providers: [FavoriteService, FavoriteSubscriber],
  exports: [FavoriteService],
})
export class FavoriteModule {}
