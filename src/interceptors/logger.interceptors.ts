import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Request, Response } from "express";
import { PinoLogger } from "nestjs-pino";
import { ConfigService } from "@nestjs/config";
import { v1 as uuidv1 } from "uuid";
import { isRabbitContext } from "@golevelup/nestjs-rabbitmq";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger: PinoLogger;
  private configService: ConfigService<any>;

  constructor(configService: ConfigService<any>) {
    this.configService = configService;
    this.logger = new PinoLogger(this.configService.get("logger"));
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (isRabbitContext(context)) return next.handle();
    const start = Date.now();
    const req: Request = context.switchToHttp().getRequest();
    if (this.configService.get("logger.exclude").length > 0) {
      for (const path of this.configService.get("logger.exclude")) {
        if (new RegExp(`${path}$`).test(req.url)) return next.handle();
      }
    }
    let id = uuidv1();
    if (req.headers["x-correlation-id"])
      id = req.headers["x-correlation-id"] as string;
    else req.headers["x-correlation-id"] = id;
    const res: Response = context.switchToHttp().getResponse();
    res.setHeader("x-correlation-id", id);
    const { method, url, body } = req;
    const { statusCode } = res;
    if (this.configService.get("logger.pinoHttp.level") === "trace") {
      this.logger.trace({
        msg: `${method} ${url} ${statusCode}`,
        cid: id,
        body: body,
      });
    } else
      this.logger.debug({ msg: `${method} ${url} ${statusCode}`, cid: id });

    return next.handle().pipe(
      tap({
        next: (val) => {
          this.logger.trace({
            msg: `Response ${statusCode} ${Date.now() - start}ms`,
            cid: id,
            body:
              typeof val == "object" ? JSON.parse(JSON.stringify(val)) : val,
            ms: Date.now() - start,
          });
        },
        error: (error) => {
          this.logger.error({
            msg: `${error.message}`,
            cid: id,
            ms: Date.now() - start,
          });
        },
      })
    );
  }
}
