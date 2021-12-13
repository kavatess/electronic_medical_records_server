import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { FileManagementService } from "./file-management.service";

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        timeout: configService.get("http.timeout"),
        maxRedirects: configService.get("http.maxRedirects"),
        baseURL: `${configService.get("http.baseUrl")}/file-management`,
      }),
    }),
  ],
  providers: [FileManagementService],
  exports: [FileManagementService],
})
export class FileManagementModule {}
