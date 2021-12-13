import { CacheModule, Module } from "@nestjs/common";
import { ChartTemplateCustomController } from "./controllers/chart-template.custom.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

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
  ],
  controllers: [ChartTemplateCustomController],
  providers: [],
  exports: [],
})
export class ChartTemplateModule {}
