import { CacheModule, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DiagnosisController } from "./controllers/diagnosis.controller";
import { DiagnosisCustomController } from "./controllers/diagnosis.custom.controller";
import { DiagnosisLinkedListController } from "./controllers/diagnosis.linked-list.controller";
import { DiagnosisService } from "./diagnosis.service";
import { Diagnosis, DiagnosisSchema } from "./schemas/diagnosis.schema";
import { DiagnosisSubscriber } from "./diagnosis.subscriber";
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

export const LOCALE_ENUM = ["vi", "en"];

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
        name: Diagnosis.name,
        inject: [RabbitBaseService, ConfigService, EventEmitter2, PinoLogger],
        useFactory: function (
          rabbitBaseService: RabbitBaseService,
          configService: ConfigService,
          eventEmitter: EventEmitter2,
          logger: PinoLogger
        ) {
          const schema = DiagnosisSchema;
          schema.plugin(resourceEvent(rabbitBaseService), {
            resource: "Diagnosis",
            role: "master",
            app: configService.get("app.name"),
          });
          schema.plugin(socketEmit(rabbitBaseService), {
            resource: "Diagnosis",
          });
          schema.plugin(localEmit(eventEmitter, logger), {
            resource: "Diagnosis",
            populate: [],
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [
    DiagnosisController,
    DiagnosisCustomController,
    DiagnosisLinkedListController,
  ],
  providers: [DiagnosisService, DiagnosisSubscriber],
  exports: [DiagnosisService],
})
export class DiagnosisModule {}
