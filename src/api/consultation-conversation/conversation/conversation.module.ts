import { CacheModule, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConversationController } from "./controllers/conversation.controller";
import { ConversationCustomController } from "./controllers/conversation.custom.controller";
import { ConversationLinkedListController } from "./controllers/conversation.linked-list.controller";
import { ConversationService } from "./conversation.service";
import {
  Conversation,
  ConversationSchema,
} from "./schemas/conversation.schema";
import { RabbitBaseModule } from "src/hooks/rabbitmq/rabbit-base.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";
import { resourceEvent } from "src/hooks/database/plugins/resource-event.plugin";
import { socketEmit } from "src/hooks/database/plugins/socket-emit.plugin";
import { localEmit } from "src/hooks/database/plugins/local-emit.plugin";
import { JwtModule } from "@nestjs/jwt";
import { CaslModule } from "src/auth/casl/casl.module";
import { UserModule } from "src/auth/user/user.module";
import { UserRoleModule } from "src/auth/user-role/user-role.module";
import { EventEmitter2, EventEmitterModule } from "@nestjs/event-emitter";
import { LoggerModule, PinoLogger } from "nestjs-pino";

export const TYPE_ENUM = ["peer-to-peer", "group", "group-small"];

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
        imports: [
          RabbitBaseModule,
          ConfigModule,
          EventEmitterModule,
          LoggerModule,
        ],
        name: Conversation.name,
        inject: [RabbitBaseService, ConfigService, EventEmitter2, PinoLogger],
        useFactory: function (
          rabbitBaseService: RabbitBaseService,
          configService: ConfigService,
          eventEmitter: EventEmitter2,
          logger: PinoLogger
        ) {
          const schema = ConversationSchema;
          schema.plugin(resourceEvent(rabbitBaseService), {
            resource: "Conversation",
            role: "master",
            app: configService.get("app.name"),
          });
          schema.plugin(socketEmit(rabbitBaseService), {
            resource: "Conversation",
          });
          schema.plugin(localEmit(eventEmitter, logger), {
            resource: "Conversation",
            populate: [],
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [
    ConversationController,
    ConversationCustomController,
    ConversationLinkedListController,
  ],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}
