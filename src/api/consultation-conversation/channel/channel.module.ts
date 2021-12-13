import { CacheModule, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ChannelController } from "./controllers/channel.controller";
import { ChannelCustomController } from "./controllers/channel.custom.controller";
import { ChannelLinkedListController } from "./controllers/channel.linked-list.controller";
import { ChannelService } from "./channel.service";
import { Channel, ChannelSchema } from "./schemas/channel.schema";
import { RabbitBaseModule } from "src/hooks/rabbitmq/rabbit-base.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { localEmit } from "src/hooks/database/plugins/local-emit.plugin";
import { JwtModule } from "@nestjs/jwt";
import { CaslModule } from "src/auth/casl/casl.module";
import { UserModule } from "src/auth/user/user.module";
import { UserRoleModule } from "src/auth/user-role/user-role.module";
import { EventEmitter2, EventEmitterModule } from "@nestjs/event-emitter";
import { LoggerModule, PinoLogger } from "nestjs-pino";

export const PLATFORM_ENUM = ["facebook", "onemr", "zalo"];
export const WEBVIEW_HEIGHT_RATIO_ENUM = ["tall"];
export const WEBVIEW_SHARE_BUTTON_ENUM = ["show", "hide"];

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
        name: Channel.name,
        imports: [EventEmitterModule, LoggerModule],
        useFactory: function (eventEmitter: EventEmitter2, logger: PinoLogger) {
          const schema = ChannelSchema;
          schema.plugin(localEmit(eventEmitter, logger), {
            resource: "Channel",
            populate: [],
          });
          return schema;
        },
        inject: [EventEmitter2, PinoLogger],
      },
    ]),
  ],
  controllers: [
    ChannelController,
    ChannelCustomController,
    ChannelLinkedListController,
  ],
  providers: [ChannelService],
  exports: [ChannelService],
})
export class ChannelModule {}
