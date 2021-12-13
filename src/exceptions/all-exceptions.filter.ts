import {
  ExceptionFilter,
  Catch,
  HttpException,
  HttpStatus,
  ArgumentsHost,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PinoLogger } from "nestjs-pino";
import * as errorRegex from "./error-message-regex.json";
import * as errorTranslation from "./error-message-translation.json";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger: PinoLogger;
  private configService: ConfigService<any>;

  constructor(configService: ConfigService<any>) {
    this.configService = configService;
    this.logger = new PinoLogger(this.configService.get("logger"));
    this.logger.setContext(AllExceptionsFilter.name);
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const cid = ctx.getRequest().headers["x-correlation-id"];
    const response = ctx.getResponse();
    let locale = ctx.getRequest().query.locale;
    const supportedLocales = ["en", "vi"];
    if (!supportedLocales.includes(locale)) locale = supportedLocales[0];
    let code: number;
    let message: string;
    let details: any;
    let statusCode: HttpStatus = 200;
    let stack: string;
    if (exception instanceof HttpException) {
      code = exception.getStatus();
      statusCode = exception.getStatus();
      message = exception.message;
      stack = exception.stack;
      details =
        exception.getResponse() instanceof String
          ? exception.getResponse()
          : (exception.getResponse() as any).message;
      if (!details) details = exception.getResponse();
      this.logger.warn({
        msg: exception.message,
        cid: cid,
        code: code,
        statusCode: statusCode,
        stack: exception.stack,
        details: details,
      });
    } else if (exception instanceof Error) {
      message = exception.message;
      code = parseInt(message.split(" ")[0]);
      if (!Number(code)) {
        statusCode = 400;
        for (const reg in errorRegex) {
          if (message.match(reg)) message = errorRegex[reg];
        }
        code = parseInt(message.split(" ")[0]) || 400;
        stack = exception.stack;
      }
      statusCode = parseInt(code.toString().substring(0, 3));
      this.logger.error({
        msg: exception.message,
        cid: cid,
        code: code,
        statusCode: statusCode,
        stack: exception.stack,
        details: details,
      });
    }
    if (errorTranslation[message]) {
      message = errorTranslation[message][locale]
        ? errorTranslation[message][locale]
        : message;
    } else
      this.logger.error({
        msg: `critical: error message not translated`,
        errorMessage: message,
        cid: cid,
      });
    response.status(statusCode).json({
      code: code,
      message: message,
      details: details,
      stack: stack,
      results: {},
    });
  }
}
