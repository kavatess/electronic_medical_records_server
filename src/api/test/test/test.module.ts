import { CacheModule, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TestController } from "./controllers/test.controller";
import { TestCustomController } from "./controllers/test.custom.controller";
import { TestLinkedListController } from "./controllers/test.linked-list.controller";
import { TestService } from "./test.service";
import { Test, TestSchema } from "./schemas/test.schema";
import { TestSubscriber } from "./test.subscriber";
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

export const TYPE_ENUM = ["lab", "imaging"];
export const SPECIMEN_ENUM = [
  "E",
  "C",
  "S",
  "F",
  "P",
  "Đ",
  "D",
  "NT",
  "ESR tube",
  "ST/SPECIFIC TUBE",
  "LITHIUM HEPARIN",
];
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
        name: Test.name,
        inject: [RabbitBaseService, ConfigService, EventEmitter2, PinoLogger],
        useFactory: function (
          rabbitBaseService: RabbitBaseService,
          configService: ConfigService,
          eventEmitter: EventEmitter2,
          logger: PinoLogger
        ) {
          const schema = TestSchema;
          schema.plugin(resourceEvent(rabbitBaseService), {
            resource: "Test",
            role: "master",
            app: configService.get("app.name"),
          });
          schema.plugin(socketEmit(rabbitBaseService), {
            resource: "Test",
          });
          schema.plugin(localEmit(eventEmitter, logger), {
            resource: "Test",
            populate: [],
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [TestController, TestCustomController, TestLinkedListController],
  providers: [TestService, TestSubscriber],
  exports: [TestService],
})
export class TestModule {}
