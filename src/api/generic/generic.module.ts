import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GenericService } from "./generic.service";

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        timeout: configService.get("http.timeout"),
        maxRedirects: configService.get("http.maxRedirects"),
        baseURL: `${configService.get("http.baseUrl")}/api`,
      }),
    }),
  ],
  providers: [GenericService],
  exports: [GenericService],
})
export class GenericModule {}
