import { CacheModule, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RelationshipController } from "./controllers/relationship.controller";
import { RelationshipCustomController } from "./controllers/relationship.custom.controller";
import { RelationshipLinkedListController } from "./controllers/relationship.linked-list.controller";
import { RelationshipService } from "./relationship.service";
import {
  Relationship,
  RelationshipSchema,
} from "./schemas/relationship.schema";

import { RabbitBaseModule } from "src/hooks/rabbitmq/rabbit-base.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";
import { resourceEvent } from "src/hooks/database/plugins/resource-event.plugin";
import { socketEmit } from "src/hooks/database/plugins/socket-emit.plugin";
import { JwtModule } from "@nestjs/jwt";
import { CaslModule } from "src/auth/casl/casl.module";
import { UserModule } from "src/auth/user/user.module";
import { UserRoleModule } from "src/auth/user-role/user-role.module";
import { localEmit } from "src/hooks/database/plugins/local-emit.plugin";
import { EventEmitter2, EventEmitterModule } from "@nestjs/event-emitter";
import { LoggerModule, PinoLogger } from "nestjs-pino";

export const RELATIONSHIP_ENUM = [
  "child",
  "parent",
  "sibling",
  "spouse",
  "doctor",
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
        imports: [
          RabbitBaseModule,
          ConfigModule,
          EventEmitterModule,
          LoggerModule,
        ],
        name: Relationship.name,
        inject: [RabbitBaseService, ConfigService, EventEmitter2, PinoLogger],
        useFactory: function (
          rabbitBaseService: RabbitBaseService,
          configService: ConfigService,
          eventEmitter: EventEmitter2,
          logger: PinoLogger
        ) {
          const schema = RelationshipSchema;
          schema.plugin(resourceEvent(rabbitBaseService), {
            resource: "Relationship",
            role: "master",
            app: configService.get("app.name"),
          });
          schema.plugin(socketEmit(rabbitBaseService), {
            resource: "Relationship",
          });
          schema.plugin(localEmit(eventEmitter, logger), {
            resource: "Relationship",
            populate: [],
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [
    RelationshipController,
    RelationshipCustomController,
    RelationshipLinkedListController,
  ],
  providers: [RelationshipService],
  exports: [RelationshipService],
})
export class RelationshipModule {}
