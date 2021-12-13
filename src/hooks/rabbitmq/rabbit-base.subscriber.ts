import { Injectable } from "@nestjs/common";
import { PinoLogger } from "nestjs-pino";
import { MAIN_EXCHANGE } from "src/common/constants";
import { RabbitBaseService } from "./rabbit-base.service";

@Injectable()
export class RabbitBaseSubscriber {
  constructor(
    protected readonly rabbitService: RabbitBaseService,
    protected readonly loggerService: PinoLogger
  ) {}

  handleErrorMessage(msg: Record<string, any>, err: Error | string): void {
    this.loggerService.error({
      type: "RABBITMQ_SUBSCRIBE_ERROR",
      msg: err["message"] || err,
    });
    this.rabbitService.publish(
      MAIN_EXCHANGE,
      "consultation-server.master.error",
      {
        ...msg,
        _error: err["message"] || err,
        timestamp: new Date().toISOString(),
      }
    );
  }
}
