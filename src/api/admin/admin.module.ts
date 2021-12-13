import { CacheModule, HttpModule, Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { UserModule } from "../../auth/user/user.module";
import { UserRoleModule } from "../../auth/user-role/user-role.module";
import { CaslModule } from "src/auth/casl/casl.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AdminService } from "./admin.service";

@Module({
  imports: [
    UserModule,
    UserRoleModule,
    HttpModule,
    CaslModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.get("cache"),
      inject: [ConfigService],
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
