import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Transport } from "@nestjs/microservices/enums/transport.enum";
import { ApiTags } from "@nestjs/swagger";
import {
  HealthCheckService,
  HealthCheck,
  MongooseHealthIndicator,
  MicroserviceHealthIndicator,
} from "@nestjs/terminus";
@ApiTags("admin")
@Controller("/health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mongodb: MongooseHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
    private configService: ConfigService
  ) {}

  // Used for human inspection.
  @Get()
  @HealthCheck()
  check(): Promise<any> {
    return this.health.check([
      () => this.mongodb.pingCheck("mongodb", { timeout: 1500 }),
      () =>
        this.microservice.pingCheck("rabbitmq", {
          timeout: 5000,
          transport: Transport.RMQ,
          options: { urls: [this.configService.get("rabbitmq.uri")] },
        }),
    ]);
  }

  // Used to configure liveness probe.
  @Get("live")
  @HealthCheck()
  readinessProbe(): Promise<any> {
    return this.health.check([
      () => this.mongodb.pingCheck("mongodb", { timeout: 1500 }),
      () =>
        this.microservice.pingCheck("rabbitmq", {
          timeout: 5000,
          transport: Transport.RMQ,
          options: { urls: [this.configService.get("rabbitmq.uri")] },
        }),
    ]);
  }

  // Used to configure readiness probe.
  @Get("ready")
  @HealthCheck()
  livenessProbe(): Promise<any> {
    return this.health.check([
      () => this.mongodb.pingCheck("mongodb", { timeout: 1500 }),
      () =>
        this.microservice.pingCheck("rabbitmq", {
          timeout: 5000,
          transport: Transport.RMQ,
          options: { urls: [this.configService.get("rabbitmq.uri")] },
        }),
    ]);
  }
}
