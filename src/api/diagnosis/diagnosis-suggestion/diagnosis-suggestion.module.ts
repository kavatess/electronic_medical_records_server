import { CacheModule, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DiagnosisSuggestionController } from "./controllers/diagnosis-suggestion.controller";
import { DiagnosisSuggestionCustomController } from "./controllers/diagnosis-suggestion.custom.controller";
import { DiagnosisSuggestionLinkedListController } from "./controllers/diagnosis-suggestion.linked-list.controller";
import { DiagnosisSuggestionService } from "./diagnosis-suggestion.service";
import {
  DiagnosisSuggestion,
  DiagnosisSuggestionSchema,
} from "./schemas/diagnosis-suggestion.schema";
import { DiagnosisSuggestionSubscriber } from "./diagnosis-suggestion.subscriber";
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
        name: DiagnosisSuggestion.name,
        inject: [RabbitBaseService, ConfigService, EventEmitter2, PinoLogger],
        useFactory: function (
          rabbitBaseService: RabbitBaseService,
          configService: ConfigService,
          eventEmitter: EventEmitter2,
          logger: PinoLogger
        ) {
          const schema = DiagnosisSuggestionSchema;
          schema.plugin(resourceEvent(rabbitBaseService), {
            resource: "DiagnosisSuggestion",
            role: "master",
            app: configService.get("app.name"),
          });
          schema.plugin(socketEmit(rabbitBaseService), {
            resource: "DiagnosisSuggestion",
          });
          schema.plugin(localEmit(eventEmitter, logger), {
            resource: "DiagnosisSuggestion",
            populate: [],
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [
    DiagnosisSuggestionController,
    DiagnosisSuggestionCustomController,
    DiagnosisSuggestionLinkedListController,
  ],
  providers: [DiagnosisSuggestionService, DiagnosisSuggestionSubscriber],
  exports: [DiagnosisSuggestionService],
})
export class DiagnosisSuggestionModule {}
