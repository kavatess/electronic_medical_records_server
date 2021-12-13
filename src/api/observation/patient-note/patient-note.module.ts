import { CacheModule, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PatientNoteController } from "./controllers/patient-note.controller";
import { PatientNoteCustomController } from "./controllers/patient-note.custom.controller";
import { PatientNoteLinkedListController } from "./controllers/patient-note.linked-list.controller";
import { PatientNoteService } from "./patient-note.service";
import { PatientNote, PatientNoteSchema } from "./schemas/patient-note.schema";
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

export const TYPE_ENUM = [
  "medical-history",
  "allergies",
  "current-medications",
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
        name: PatientNote.name,
        inject: [RabbitBaseService, ConfigService, EventEmitter2, PinoLogger],
        useFactory: function (
          rabbitBaseService: RabbitBaseService,
          configService: ConfigService,
          eventEmitter: EventEmitter2,
          logger: PinoLogger
        ) {
          const schema = PatientNoteSchema;
          schema.plugin(resourceEvent(rabbitBaseService), {
            resource: "PatientNote",
            role: "master",
            app: configService.get("app.name"),
          });
          schema.plugin(socketEmit(rabbitBaseService), {
            resource: "PatientNote",
          });
          schema.plugin(localEmit(eventEmitter, logger), {
            resource: "PatientNote",
            populate: [],
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [
    PatientNoteController,
    PatientNoteCustomController,
    PatientNoteLinkedListController,
  ],
  providers: [PatientNoteService],
  exports: [PatientNoteService],
})
export class PatientNoteModule {}
