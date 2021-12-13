import { HttpModule, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ShortlinkService } from "./shortlink.service";
// import { ShortlinkController } from './shortlink.controller';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        timeout: configService.get("http.timeout"),
        maxRedirects: configService.get("http.maxRedirects"),
        baseURL: configService.get("http.baseUrl"),
      }),
    }),
  ],
  controllers: [
    // ShortlinkController
  ],
  providers: [ShortlinkService],
  exports: [ShortlinkService],
})
export class ShortlinkModule {}
