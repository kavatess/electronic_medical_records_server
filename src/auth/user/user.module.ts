import { CacheModule, forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { User, UserSchema } from "./schemas/user.schema";
import { RabbitBaseModule } from "src/hooks/rabbitmq/rabbit-base.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RabbitBaseService } from "src/hooks/rabbitmq/rabbit-base.service";
import { resourceEvent } from "src/hooks/database/plugins/resource-event.plugin";
import { socketEmit } from "src/hooks/database/plugins/socket-emit.plugin";
import { JwtModule } from "@nestjs/jwt";
import { CaslModule } from "src/auth/casl/casl.module";
import { UserRoleModule } from "../user-role/user-role.module";

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
    forwardRef(() => UserRoleModule),
    MongooseModule.forFeatureAsync([
      {
        imports: [RabbitBaseModule, ConfigModule],
        name: User.name,
        inject: [RabbitBaseService, ConfigService],
        useFactory: function (
          rabbitBaseService: RabbitBaseService,
          configService: ConfigService
        ) {
          const schema = UserSchema;
          schema.plugin(resourceEvent(rabbitBaseService), {
            resource: "User",
            role: "master",
            app: configService.get("app.name"),
          });
          schema.plugin(socketEmit(rabbitBaseService), { resource: "User" });
          return schema;
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
