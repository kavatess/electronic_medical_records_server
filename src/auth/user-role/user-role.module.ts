import { CacheModule, forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserRoleController } from "./user-role.controller";
import { UserRoleService } from "./user-role.service";
import { UserRole, UserRoleSchema } from "./schemas/user-role.schema";
import { RabbitBaseModule } from "src/hooks/rabbitmq/rabbit-base.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";
import { resourceEvent } from "src/hooks/database/plugins/resource-event.plugin";
import { socketEmit } from "src/hooks/database/plugins/socket-emit.plugin";
import { JwtModule } from "@nestjs/jwt";
import { CaslModule } from "src/auth/casl/casl.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("auth.secret"),
      }),
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
    forwardRef(() => UserModule),
    MongooseModule.forFeatureAsync([
      {
        imports: [RabbitBaseModule, ConfigModule],
        name: UserRole.name,
        inject: [RabbitBaseService, ConfigService],
        useFactory: function (
          rabbitBaseService: RabbitBaseService,
          configService: ConfigService
        ) {
          const schema = UserRoleSchema;
          schema.plugin(resourceEvent(rabbitBaseService), {
            resource: "UserRole",
            role: "master",
            app: configService.get("app.name"),
          });
          schema.plugin(socketEmit(rabbitBaseService), {
            resource: "UserRole",
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [UserRoleController],
  providers: [UserRoleService],
  exports: [UserRoleService],
})
export class UserRoleModule {}
