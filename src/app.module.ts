import { CacheModule, Module } from "@nestjs/common";
import { RabbitBaseModule } from "./hooks/rabbitmq/rabbit-base.module";
import { DatabaseModule } from "./hooks/database/database.module";
import { HealthModule } from "./hooks/health/health.module";
import { CaslModule } from "./auth/casl/casl.module";
import { AdminModule } from "./api/admin/admin.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { validate } from "./config/env.validation";
import authConfig from "./config/sections/auth.config";
import mongodbConfig from "./config/sections/mongodb.config";
import cachConfig from "./config/sections/cach.config";
import rabbitmqConfig from "./config/sections/rabbitmq.config";
import appConfig from "./config/sections/app.config";
import loggerConfig from "./config/sections/logger.config";
import corsConfig from "./config/sections/cors.config";
import openapiConfig from "./config/sections/openapi.config";
import httpConfig from "./config/sections/http.config";
import { LoggerModule } from "nestjs-pino";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { UserModule } from "./auth/user/user.module";
import { UserRoleModule } from "./auth/user-role/user-role.module";
import { UtilityModule } from "./utils/utils.module";
import { ConsultationModule } from "./api/consultation/consultation.module";
import { ConversationModule } from "./api/consultation-conversation/conversation/conversation.module";
import { ChannelModule } from "./api/consultation-conversation/channel/channel.module";
import { ConversationUserModule } from "./api/consultation-conversation/conversation-user/conversation-user.module";
import { DiagnosisModule } from "./api/diagnosis/diagnosis/diagnosis.module";
import { DiagnosisSuggestionModule } from "./api/diagnosis/diagnosis-suggestion/diagnosis-suggestion.module";
import { FavoriteModule } from "./api/diagnosis/favorite/favorite.module";
import { MedicalReferenceModule } from "./api/medical-reference/medical-reference.module";
import { PrescriptionModule } from "./api/prescription/prescription.module";
import { ProviderModule } from "./api/provider/provider.module";
import { RelationshipModule } from "./api/user/relationship/relationship.module";
import { ShortlinkModule } from "./api/user/shortlink/shortlink.module";
import { ObservationModule } from "./api/observation/observation/observation.module";
import { TestModule } from "./api/test/test/test.module";
import { TestRequestModule } from "./api/test/test-request/test-request.module";
import { TestResultModule } from "./api/test/test-result/test-result.module";
import { ChartTemplateModule } from "./api/observation/chart-template/chart-template.module";
import { OrderModule } from "./api/order/order.module";
import { GenericModule } from "./api/generic/generic.module";
import { FileManagementModule } from "./api/file-management/file-management.module";

@Module({
  imports: [
    // common
    ConfigModule.forRoot({
      envFilePath: process.env.ENV_FILEPATH || undefined,
      isGlobal: true,
      cache: true,
      expandVariables: true,
      validate,
      load: [
        appConfig,
        authConfig,
        cachConfig,
        corsConfig,
        loggerConfig,
        mongodbConfig,
        openapiConfig,
        rabbitmqConfig,
        httpConfig,
      ],
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get("logger"),
    }),
    HealthModule,
    CacheModule.register(),
    DatabaseModule,
    RabbitBaseModule,
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: ".",
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
    CaslModule,
    AdminModule,
    UserModule,
    UserRoleModule,
    // logic
    UtilityModule,
    ConsultationModule,
    ConversationModule,
    ChannelModule,
    ConversationUserModule,
    DiagnosisModule,
    DiagnosisSuggestionModule,
    FavoriteModule,
    ObservationModule,
    MedicalReferenceModule,
    PrescriptionModule,
    ProviderModule,
    RelationshipModule,
    ShortlinkModule,
    TestModule,
    TestRequestModule,
    TestResultModule,
    ChartTemplateModule,
    OrderModule,
    GenericModule,
    FileManagementModule,
  ],
})
export class AppModule {}
