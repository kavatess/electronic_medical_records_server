import { CacheModule, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConversationUserController } from "./controllers/conversation-user.controller";
import { ConversationUserCustomController } from "./controllers/conversation-user.custom.controller";
import { ConversationUserLinkedListController } from "./controllers/conversation-user.linked-list.controller";
import { ConversationUserService } from "./conversation-user.service";
import {
  ConversationUser,
  ConversationUserSchema,
} from "./schemas/conversation-user.schema";
import { RabbitBaseModule } from "src/hooks/rabbitmq/rabbit-base.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { CaslModule } from "src/auth/casl/casl.module";
import { UserModule } from "src/auth/user/user.module";
import { UserRoleModule } from "src/auth/user-role/user-role.module";
import { localEmit } from "src/hooks/database/plugins/local-emit.plugin";
import { EventEmitter2, EventEmitterModule } from "@nestjs/event-emitter";
import { LoggerModule, PinoLogger } from "nestjs-pino";
import { socketEmit } from "src/hooks/database/plugins/socket-emit.plugin";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";

export const ROLE_ENUM = [
  "owner",
  "provider",
  "user",
  "patient",
  "support",
  "admin",
  "guest",
];
export const CHATPOLICY_ENUM = ["allowed", "readonly", "restricted"];
export const STATE_ENUM = ["active", "inactive"];

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
        name: ConversationUser.name,
        imports: [RabbitBaseModule, EventEmitterModule, LoggerModule],
        useFactory: function (
          rabbitBaseService: RabbitBaseService,
          eventEmitter: EventEmitter2,
          logger: PinoLogger
        ) {
          const schema = ConversationUserSchema;
          schema.plugin(socketEmit(rabbitBaseService), {
            resource: "ConversationUser",
          });
          schema.plugin(localEmit(eventEmitter, logger), {
            resource: "ConversationUser",
            populate: [],
          });
          return schema;
        },
        inject: [RabbitBaseService, EventEmitter2, PinoLogger],
      },
    ]),
  ],
  controllers: [
    ConversationUserController,
    ConversationUserCustomController,
    ConversationUserLinkedListController,
  ],
  providers: [ConversationUserService],
  exports: [ConversationUserService],
})
export class ConversationUserModule {}
