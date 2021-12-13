import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MessagingController } from "src/hooks/rabbitmq/messaging.controller";
import { RabbitBaseService } from "./rabbit-base.service";

class Headers {
  "x-correlation-id"?: string;
  "x-auth-user"?: string;
}
export interface IMessage<IQuery, IData> {
  _routingKey?: string;
  _error?: any;
  headers?: Headers;
  query: IQuery;
  data: IData;
}
@Module({
  imports: [
    ConfigModule.forRoot({ cache: true }),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get("rabbitmq.uri"),
        exchanges: [{ name: "ResourceEvent", type: "topic" }],
        prefetchCount: configService.get("rabbitmq.prefetchCount"),
        connectionInitOptions: configService.get(
          "rabbitmq.connectionInitOptions"
        ),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [RabbitBaseService],
  controllers: [MessagingController],
  exports: [RabbitBaseService],
})
export class RabbitBaseModule {}
