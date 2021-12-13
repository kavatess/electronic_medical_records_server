import { CacheModule, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TestRequestController } from "./controllers/test-request.controller";
import { TestRequestCustomController } from "./controllers/test-request.custom.controller";
import { TestRequestLinkedListController } from "./controllers/test-request.linked-list.controller";
import { TestRequestService } from "./test-request.service";
import { TestRequest, TestRequestSchema } from "./schemas/test-request.schema";
import { TestRequestSubscriber } from "./test-request.subscriber";
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
import { TestModule } from "../test/test.module";
import { ProviderModule } from "src/api/provider/provider.module";
import { ConsultationModule } from "src/api/consultation/consultation.module";

export const STATE_ENUM = ["new", "ordered", "result-ready"];
export const URGENCY_ENUM = ["normal", "urgent"];

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
    TestModule,
    ProviderModule,
    ConsultationModule,
    MongooseModule.forFeatureAsync([
      {
        imports: [
          RabbitBaseModule,
          ConfigModule,
          EventEmitterModule,
          LoggerModule,
        ],
        name: TestRequest.name,
        inject: [RabbitBaseService, ConfigService, EventEmitter2, PinoLogger],
        useFactory: function (
          rabbitBaseService: RabbitBaseService,
          configService: ConfigService,
          eventEmitter: EventEmitter2,
          logger: PinoLogger
        ) {
          const schema = TestRequestSchema;
          schema.plugin(resourceEvent(rabbitBaseService), {
            resource: "TestRequest",
            role: "master",
            app: configService.get("app.name"),
          });
          schema.plugin(socketEmit(rabbitBaseService), {
            resource: "TestRequest",
          });
          schema.plugin(localEmit(eventEmitter, logger), {
            resource: "TestRequest",
            populate: [],
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [
    TestRequestController,
    TestRequestCustomController,
    TestRequestLinkedListController,
  ],
  providers: [TestRequestService, TestRequestSubscriber],
  exports: [TestRequestService],
})
export class TestRequestModule {}
