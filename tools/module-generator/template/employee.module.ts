import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
//controller// import { EmployeeController } from './controllers/employee.controller';
//controller// import { EmployeeCustomController } from './controllers/employee.custom.controller';
//controller// import { EmployeeLinkedListController } from './controllers/employee.linked-list.controller';
//service// import { EmployeeService } from './employee.service';
import { Employee, EmployeeSchema } from './schemas/employee.schema';
//subscriber// import { EmployeeSubscriber } from './employee.subscriber';
import { RabbitBaseModule } from 'src/hooks/rabbitmq/rabbit-base.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitBaseService } from 'src/hooks/rabbitmq/rabbit-base.service';
//schema.publish-queue// import { resourceEvent } from 'src/hooks/database/plugins/resource-event.plugin';
//schema.publish-socket// import { socketEmit } from 'src/hooks/database/plugins/socket-emit.plugin';
import { JwtModule } from '@nestjs/jwt';
import { CaslModule } from 'src/auth/casl/casl.module';
import { UserModule } from 'src/auth/user/user.module';
import { UserRoleModule } from 'src/auth/user-role/user-role.module';
//schema.publish-local// import { localEmit } from 'src/hooks/database/plugins/local-emit.plugin';
//schema.publish-local// import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { LoggerModule, PinoLogger } from 'nestjs-pino';

//export_constant//

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => configService.get('auth'),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => configService.get('cache'),
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
          //schema.publish-local// EventEmitterModule,
          LoggerModule,
        ],
        name: Employee.name,
        inject: [
          RabbitBaseService,
          ConfigService,
          //schema.publish-local// EventEmitter2,
          PinoLogger,
        ],
        useFactory: function (
          //schema.publish-queue// rabbitBaseService: RabbitBaseService,
          configService: ConfigService,
          //schema.publish-local// eventEmitter: EventEmitter2,
          logger: PinoLogger
        ) {
          const schema = EmployeeSchema;
          //schema.publish-queue//  schema.plugin(resourceEvent(rabbitBaseService), {resource: 'Employee',role: 'master',app: configService.get('app.name')});
          //schema.publish-socket// schema.plugin(socketEmit(rabbitBaseService), {resource: 'Employee'});
          //schema.publish-local//  schema.plugin(localEmit(eventEmitter, logger), {resource: 'Employee',populate: []});
          return schema;
        },
      },
    ]),
  ],
  controllers: [
    //controller// EmployeeController,
    //controller// EmployeeCustomController,
    //controller// EmployeeLinkedListController
  ],
  providers: [
    //service// EmployeeService,
    //subscriber// EmployeeSubscriber
  ],
  exports: [
    //service// EmployeeService
  ],
})
export class EmployeeModule { }
