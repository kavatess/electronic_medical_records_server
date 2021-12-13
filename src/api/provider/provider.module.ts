import { CacheModule, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProviderService } from "./provider.service";
import { Provider, ProviderSchema } from "./schemas/provider.schema";
import { RabbitBaseModule } from "src/hooks/rabbitmq/rabbit-base.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";
import { resourceEvent } from "src/hooks/database/plugins/resource-event.plugin";
import { socketEmit } from "src/hooks/database/plugins/socket-emit.plugin";
import { localEmit } from "src/hooks/database/plugins/local-emit.plugin";
import { EventEmitter2, EventEmitterModule } from "@nestjs/event-emitter";
import { LoggerModule, PinoLogger } from "nestjs-pino";
import { ProviderController } from "./controllers/provider.controller";
import { ProviderLinkedListController } from "./controllers/provider.linked-list.controller";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/auth/user/user.module";
import { UserRoleModule } from "src/auth/user-role/user-role.module";
import { CaslModule } from "src/auth/casl/casl.module";

export const TITLE_ENUM = [
  "Bs",
  "Bs.CK1",
  "Bs.CK2",
  "ThS.Bs",
  "TS.Bs",
  "PGS.Bs",
  "GS.Bs",
  "Ch.G.TL",
  "ThS.TL",
  "TLG",
];
export const CONTRACT_ENUM = [
  "waitingContract",
  "sendContract",
  "receivedContract",
];
export const CONSULTTIME_ENUM = [0, 10, 15, 20, 25, 30, 45, 60];

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
    RabbitBaseModule,
    MongooseModule.forFeatureAsync([
      {
        imports: [
          RabbitBaseModule,
          ConfigModule,
          EventEmitterModule,
          LoggerModule,
        ],
        name: Provider.name,
        inject: [RabbitBaseService, ConfigService, EventEmitter2, PinoLogger],
        useFactory: function (
          rabbitBaseService: RabbitBaseService,
          configService: ConfigService,
          eventEmitter: EventEmitter2,
          logger: PinoLogger
        ) {
          const schema = ProviderSchema;
          schema.plugin(resourceEvent(rabbitBaseService), {
            resource: "Provider",
            role: "master",
            app: configService.get("app.name"),
          });
          schema.plugin(socketEmit(rabbitBaseService), {
            resource: "Provider",
          });
          schema.plugin(localEmit(eventEmitter, logger), {
            resource: "Provider",
            populate: [],
          });
          return schema;
        },
      },
    ]),
    CaslModule,
    UserModule,
    UserRoleModule,
  ],
  controllers: [ProviderController, ProviderLinkedListController],
  providers: [ProviderService],
  exports: [ProviderService],
})
export class ProviderModule {}
