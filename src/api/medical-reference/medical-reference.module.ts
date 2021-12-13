import { CacheModule, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MedicalReferenceController } from "./controllers/medical-reference.controller";
import { MedicalReferenceCustomController } from "./controllers/medical-reference.custom.controller";
import { MedicalReferenceLinkedListController } from "./controllers/medical-reference.linked-list.controller";
import { MedicalReferenceService } from "./medical-reference.service";
import {
  MedicalReference,
  MedicalReferenceSchema,
} from "./schemas/medical-reference.schema";
import { MedicalReferenceSubscriber } from "./medical-reference.subscriber";
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
import { RxFrequencyReferenceSchema } from "./discriminators/rx-frequency/schemas/rx-frequency.schema";
import { RouteOfAdministrationReferenceSchema } from "./discriminators/route-of-administration/schemas/route-of-administration.schema";
import { ObservationReferenceSchema } from "./discriminators/observation/schemas/observation.schema";
import { OtherReferenceSchema } from "./discriminators/other/schemas/other.schema";
import { RxFrequencyReferenceService } from "./discriminators/rx-frequency/rx-frequency.service";
import { OtherReferenceService } from "./discriminators/other/other.service";
import { ObservationReferenceService } from "./discriminators/observation/observation.service";
import { RouteOfAdministrationReferenceService } from "./discriminators/route-of-administration/route-of-administration.service";

export const TYPE_ENUM = [
  "rxFrequency",
  "routeOfAdministration",
  "observation",
  "other",
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
        name: MedicalReference.name,
        inject: [RabbitBaseService, ConfigService, EventEmitter2, PinoLogger],
        useFactory: function (
          rabbitBaseService: RabbitBaseService,
          configService: ConfigService,
          eventEmitter: EventEmitter2,
          logger: PinoLogger
        ) {
          const schema = MedicalReferenceSchema;
          schema.plugin(resourceEvent(rabbitBaseService), {
            resource: "MedicalReference",
            role: "master",
            app: configService.get("app.name"),
          });
          schema.plugin(socketEmit(rabbitBaseService), {
            resource: "MedicalReference",
          });
          schema.plugin(localEmit(eventEmitter, logger), {
            resource: "MedicalReference",
            populate: [],
          });
          return schema;
        },
        discriminators: [
          { name: "rxFrequency", schema: RxFrequencyReferenceSchema },
          {
            name: "routeOfAdministration",
            schema: RouteOfAdministrationReferenceSchema,
          },
          { name: "observation", schema: ObservationReferenceSchema },
          { name: "other", schema: OtherReferenceSchema },
        ],
      },
    ]),
  ],
  controllers: [
    MedicalReferenceController,
    MedicalReferenceCustomController,
    MedicalReferenceLinkedListController,
  ],
  providers: [
    MedicalReferenceService,
    MedicalReferenceSubscriber,
    RxFrequencyReferenceService,
    RouteOfAdministrationReferenceService,
    ObservationReferenceService,
    OtherReferenceService,
  ],
  exports: [
    MedicalReferenceService,
    RxFrequencyReferenceService,
    RouteOfAdministrationReferenceService,
    ObservationReferenceService,
    OtherReferenceService,
  ],
})
export class MedicalReferenceModule {}
