import { CacheModule, forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PrescriptionController } from "./controllers/prescription.controller";
import { PrescriptionCustomController } from "./controllers/prescription.custom.controller";
import { PrescriptionLinkedListController } from "./controllers/prescription.linked-list.controller";
import { PrescriptionService } from "./prescription.service";
import {
  Prescription,
  PrescriptionSchema,
} from "./schemas/prescription.schema";
import { PrescriptionSubscriber } from "./prescription.subscriber";
import { RabbitBaseModule } from "src/hooks/rabbitmq/rabbit-base.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";
import { resourceEvent } from "src/hooks/database/plugins/resource-event.plugin";
import { JwtModule } from "@nestjs/jwt";
import { CaslModule } from "src/auth/casl/casl.module";
import { UserModule } from "src/auth/user/user.module";
import { UserRoleModule } from "src/auth/user-role/user-role.module";
import { localEmit } from "src/hooks/database/plugins/local-emit.plugin";
import { EventEmitter2, EventEmitterModule } from "@nestjs/event-emitter";
import { LoggerModule, PinoLogger } from "nestjs-pino";
import { ConsultationModule } from "src/api/consultation/consultation.module";
import { MedicalReferenceModule } from "src/api/medical-reference/medical-reference.module";
import { DrugCustomController } from "./modules/drug/controllers/drug.custom.controller";
import { DrugController } from "./modules/drug/controllers/drug.controller";
import { DrugLinkedListController } from "./modules/drug/controllers/drug.linked-list.controller";
import { DrugService } from "./modules/drug/drug.service";
import { DrugSubscriber } from "./modules/drug/drug.subscriber";
import { PrescriptionAutoFillController } from "./modules/prescription-auto-fill/controllers/prescription-auto-fill.controller";
import { PrescriptionAutoFillCustomController } from "./modules/prescription-auto-fill/controllers/prescription-auto-fill.custom.controller";
import { PrescriptionAutoFillLinkedListController } from "./modules/prescription-auto-fill/controllers/prescription-auto-fill.linked-list.controller";
import { PrescriptionAutoFillService } from "./modules/prescription-auto-fill/prescription-auto-fill.service";
import { PrescriptionAutoFillSubscriber } from "./modules/prescription-auto-fill/prescription-auto-fill.subscriber";
import { Drug, DrugSchema } from "./modules/drug/schemas/drug.schema";
import { socketEmit } from "src/hooks/database/plugins/socket-emit.plugin";
import {
  PrescriptionAutoFill,
  PrescriptionAutoFillSchema,
} from "./modules/prescription-auto-fill/schemas/prescription-auto-fill.schema";

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
    MedicalReferenceModule,
    forwardRef(() => ConsultationModule),
    MongooseModule.forFeatureAsync([
      // prescription_model
      {
        imports: [
          RabbitBaseModule,
          ConfigModule,
          EventEmitterModule,
          LoggerModule,
        ],
        name: Prescription.name,
        inject: [RabbitBaseService, ConfigService, EventEmitter2, PinoLogger],
        useFactory: function (
          rabbitBaseService: RabbitBaseService,
          configService: ConfigService,
          eventEmitter: EventEmitter2,
          logger: PinoLogger
        ) {
          const schema = PrescriptionSchema;
          schema.plugin(resourceEvent(rabbitBaseService), {
            resource: "Prescription",
            role: "master",
            app: configService.get("app.name"),
            populate: [
              { path: "user" },
              { path: "consultation" },
              { path: "route" },
              { path: "frequency" },
            ],
          });
          schema.plugin(localEmit(eventEmitter, logger), {
            resource: "Prescription",
            populate: [],
          });
          return schema;
        },
      },
      // drug_model
      {
        imports: [
          RabbitBaseModule,
          ConfigModule,
          EventEmitterModule,
          LoggerModule,
        ],
        name: Drug.name,
        inject: [RabbitBaseService, ConfigService, EventEmitter2, PinoLogger],
        useFactory: function (
          rabbitBaseService: RabbitBaseService,
          configService: ConfigService,
          eventEmitter: EventEmitter2,
          logger: PinoLogger
        ) {
          const schema = DrugSchema;
          schema.plugin(resourceEvent(rabbitBaseService), {
            resource: "Drug",
            role: "master",
            app: configService.get("app.name"),
          });
          schema.plugin(socketEmit(rabbitBaseService), {
            resource: "Drug",
          });
          schema.plugin(localEmit(eventEmitter, logger), {
            resource: "Drug",
            populate: [],
          });
          return schema;
        },
      },
      // prescription_auto_fill_model
      {
        imports: [
          RabbitBaseModule,
          ConfigModule,
          EventEmitterModule,
          LoggerModule,
        ],
        name: PrescriptionAutoFill.name,
        inject: [RabbitBaseService, ConfigService, EventEmitter2, PinoLogger],
        useFactory: function (
          rabbitBaseService: RabbitBaseService,
          configService: ConfigService,
          eventEmitter: EventEmitter2,
          logger: PinoLogger
        ) {
          const schema = PrescriptionAutoFillSchema;
          schema.plugin(resourceEvent(rabbitBaseService), {
            resource: "PrescriptionAutoFill",
            role: "master",
            app: configService.get("app.name"),
          });
          schema.plugin(socketEmit(rabbitBaseService), {
            resource: "PrescriptionAutoFill",
          });
          schema.plugin(localEmit(eventEmitter, logger), {
            resource: "PrescriptionAutoFill",
            populate: [],
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [
    // prescription_controllers
    PrescriptionController,
    PrescriptionCustomController,
    PrescriptionLinkedListController,
    // drug_controllers
    DrugCustomController,
    DrugController,
    DrugLinkedListController,
    // prescription_auto_fill
    PrescriptionAutoFillController,
    PrescriptionAutoFillCustomController,
    PrescriptionAutoFillLinkedListController,
  ],
  providers: [
    // prescription_services
    PrescriptionService,
    PrescriptionSubscriber,
    // drug_services
    DrugService,
    DrugSubscriber,
    // prescription_auto_fill_services
    PrescriptionAutoFillService,
    PrescriptionAutoFillSubscriber,
  ],
  exports: [PrescriptionService, DrugService, PrescriptionAutoFillService],
})
export class PrescriptionModule {}
