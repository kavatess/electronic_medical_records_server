import { CacheModule, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ObservationController } from "./controllers/observation.controller";
import { ObservationCustomController } from "./controllers/observation.custom.controller";
import { ObservationLinkedListController } from "./controllers/observation.linked-list.controller";
import { ObservationService } from "./observation.service";
import { Observation, ObservationSchema } from "./schemas/observation.schema";
import { ObservationSubscriber } from "./observation.subscriber";
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
import { TestObservationSchema } from "./discriminators/test/schemas/test.schema";
import { HomeMonitoringObservationSchema } from "./discriminators/home-monitoring/schemas/home-monitoring.schema";
import { HomeMonitoringObservationService } from "./discriminators/home-monitoring/home-monitoring.service";
import { TestObservationService } from "./discriminators/test/test.service";
import { VaccineCustomController } from "../vaccination/controllers/vaccine.custom.controller";
import { HttpModule } from "@nestjs/axios";

export const TYPE_ENUM = ["test", "home-monitoring"];
export const STATUS_ENUM = ["draft", "published", "archived"];

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
    HttpModule,
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
        name: Observation.name,
        inject: [RabbitBaseService, ConfigService, EventEmitter2, PinoLogger],
        useFactory: function (
          rabbitBaseService: RabbitBaseService,
          configService: ConfigService,
          eventEmitter: EventEmitter2,
          logger: PinoLogger
        ) {
          const schema = ObservationSchema;
          schema.plugin(resourceEvent(rabbitBaseService), {
            resource: "Observation",
            role: "master",
            app: configService.get("app.name"),
          });
          schema.plugin(socketEmit(rabbitBaseService), {
            resource: "Observation",
          });
          schema.plugin(localEmit(eventEmitter, logger), {
            resource: "Observation",
            populate: [],
          });
          return schema;
        },
        discriminators: [
          { name: "test", schema: TestObservationSchema },
          { name: "home-monitoring", schema: HomeMonitoringObservationSchema },
        ],
      },
    ]),
  ],
  controllers: [
    VaccineCustomController,
    ObservationController,
    ObservationCustomController,
    ObservationLinkedListController,
  ],
  providers: [
    ObservationService,
    ObservationSubscriber,
    HomeMonitoringObservationService,
    TestObservationService,
  ],
  exports: [
    ObservationService,
    HomeMonitoringObservationService,
    TestObservationService,
  ],
})
export class ObservationModule {}
