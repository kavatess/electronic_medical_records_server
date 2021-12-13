import { CacheModule, forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { CaslModule } from "src/auth/casl/casl.module";
import { UserModule } from "src/auth/user/user.module";
import { UserRoleModule } from "src/auth/user-role/user-role.module";
import { RabbitBaseModule } from "src/hooks/rabbitmq/rabbit-base.module";
import { ProviderModule } from "src/api/provider/provider.module";
import { RelationshipModule } from "../user/relationship/relationship.module";
import { ConsultationConversationModule } from "../consultation-conversation/consultation-conversation.module";
import { ShortlinkModule } from "../user/shortlink/shortlink.module";
import { ConsultationService } from "./services/consultation.service";
import {
  Consultation,
  ConsultationSchema,
} from "./schemas/consultation.schema";
import { ConsultationSubscriber } from "./consultation.subscriber";
import { IndepthService } from "./discriminators/indepth/services/indepth.service";
import { QuestionService } from "./discriminators/question/services/question.service";
import { HomeTreatmentService } from "./discriminators/home-treatment/services/home-treatment.service";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { emitSocketDuduEvent } from "./plugins/emit-socket-dudu-event.plugin";
import { publishConsultationEvent } from "./plugins/publish-consultation-event.plugin";
import { socketEmit } from "src/hooks/database/plugins/socket-emit.plugin";
import { localEmit } from "src/hooks/database/plugins/local-emit.plugin";
import { EventEmitter2, EventEmitterModule } from "@nestjs/event-emitter";
import { LoggerModule, PinoLogger } from "nestjs-pino";
import { IndepthSchema } from "./discriminators/indepth/schemas/indepth.schema";
import { QuestionSchema } from "./discriminators/question/schemas/question.schema";
import { HomeTreatmentSchema } from "./discriminators/home-treatment/schemas/home-treatment.schema";
import { ConsultationController } from "./controllers/consultation.controller";
import { ConsultationLinkedListController } from "./controllers/consultation.linked-list.controller";
import { IndepthController } from "./discriminators/indepth/indepth.controller";
import { QuestionController } from "./discriminators/question/question.controller";
import { HomeTreatmentController } from "./discriminators/home-treatment/home-treatment.controller";
import { QuestionHookService } from "./discriminators/question/services/question-hook.service";
import { IndepthHookService } from "./discriminators/indepth/services/indepth-hook.service";
import { HomeTreatmentHookService } from "./discriminators/home-treatment/services/home-treatment-hook.service";
import { IndepthFormService } from "./discriminators/indepth/services/indepth-form.service";
import { CreateIndepthService } from "./discriminators/indepth/services/create-indepth.service";
import { UpdateIndepthService } from "./discriminators/indepth/services/update-indepth.service";
import { CompleteIndepthService } from "./discriminators/indepth/services/complete-indepth.service";
import { CancelIndepthService } from "./discriminators/indepth/services/cancel-indepth.service";
import { IndepthFollowUpQuestionService } from "./discriminators/indepth/services/indepth-follow-up-question.service";
import { PrescriptionModule } from "../prescription/prescription.module";
import { GetDetailForOnemrService } from "./services/get-detail-for-onemr.service";
import { ConsultationCustomController } from "./controllers/consultation.custom.controller";
import { CreateHomeTreatmentService } from "./discriminators/home-treatment/services/create-home-treatment.service";
import { UpdateHomeTreatmentService } from "./discriminators/home-treatment/services/update-home-treatment.service";
import { CompleteHomeTreatmentService } from "./discriminators/home-treatment/services/complete-home-treatment.service";
import { HomeTreatmentFormService } from "./discriminators/home-treatment/services/home-treatment-form.service";
import { CancelHomeTreatmentService } from "./discriminators/home-treatment/services/cancel-home-treatment.service";
import { CreateQuestionService } from "./discriminators/question/services/create-question.service";
import { AnswerByTextService } from "./discriminators/question/services/answer-by-text.service";
import { CompleteQuestionService } from "./discriminators/question/services/complete-question.service";
import { CancelQuestionService } from "./discriminators/question/services/cancel-question.service";
import { AuditService } from "./services/audit.service";
import { GetAllService } from "./services/get-all.service";
import { GenericModule } from "../generic/generic.module";
import { FileManagementModule } from "../file-management/file-management.module";
import { GetDetailForDuduService } from "./services/get-detail-for-dudu.service";
import { CreateConsultationFactoryService } from "./services/create-consultation.factory.service";
import { GetAllQuestionService } from "./services/get-all-question.service";

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
    RelationshipModule,
    ProviderModule,
    ShortlinkModule,
    ConsultationConversationModule,
    forwardRef(() => PrescriptionModule),
    GenericModule,
    FileManagementModule,
    MongooseModule.forFeatureAsync([
      {
        imports: [
          RabbitBaseModule,
          ConfigModule,
          EventEmitterModule,
          LoggerModule,
        ],
        name: Consultation.name,
        inject: [RabbitBaseService, ConfigService, EventEmitter2, PinoLogger],
        useFactory: function (
          rabbitBaseService: RabbitBaseService,
          configService: ConfigService,
          eventEmitter: EventEmitter2,
          logger: PinoLogger
        ) {
          const schema = ConsultationSchema;
          schema.plugin(publishConsultationEvent(rabbitBaseService), {
            baseRoutingKey: configService.get("app.name"),
            role: "master",
          });
          schema.plugin(emitSocketDuduEvent(rabbitBaseService));
          schema.plugin(socketEmit(rabbitBaseService), {
            resource: "Consultation",
          });
          schema.plugin(localEmit(eventEmitter, logger), {
            resource: "Consultation",
            populate: [],
          });
          return schema;
        },
        discriminators: [
          { name: "indepth", schema: IndepthSchema },
          { name: "question", schema: QuestionSchema },
          { name: "home-treatment", schema: HomeTreatmentSchema },
        ],
      },
    ]),
  ],
  controllers: [
    ConsultationCustomController,
    ConsultationController,
    ConsultationLinkedListController,
    IndepthController,
    QuestionController,
    HomeTreatmentController,
  ],
  providers: [
    // common_services
    ConsultationService,
    ConsultationSubscriber,
    AuditService,
    GetAllService,
    GetAllQuestionService,
    GetDetailForOnemrService,
    GetDetailForDuduService,
    CreateConsultationFactoryService,
    // indepth_services
    IndepthService,
    IndepthHookService,
    CreateIndepthService,
    UpdateIndepthService,
    IndepthFormService,
    CompleteIndepthService,
    CancelIndepthService,
    IndepthFollowUpQuestionService,
    // question_services
    QuestionService,
    QuestionHookService,
    CreateQuestionService,
    AnswerByTextService,
    CompleteQuestionService,
    CancelQuestionService,
    // home_treatment_services
    HomeTreatmentService,
    HomeTreatmentHookService,
    CreateHomeTreatmentService,
    UpdateHomeTreatmentService,
    HomeTreatmentFormService,
    CompleteHomeTreatmentService,
    CancelHomeTreatmentService,
  ],
  exports: [ConsultationService],
})
export class ConsultationModule {}
