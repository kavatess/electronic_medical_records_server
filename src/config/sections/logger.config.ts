import { registerAs } from "@nestjs/config";
import { Params } from "nestjs-pino";

export default registerAs(
  "logger",
  (): Params => ({
    /**
     * Optional parameters for `pino-http` module
     * @see https://github.com/pinojs/pino-http#pinohttpopts-stream
     */
    pinoHttp: {
      autoLogging: true,
      enabled: process.env.LOG_ENABLED === "true",
      prettyPrint:
        process.env.LOG_PRETTY === "true"
          ? {
              translateTime: process.env.LOG_TIMESTAMP === "true",
              colorize: true,
              messageFormat: "{msg}",
              crlf: false,
              levelFirst: false,
              ignore: ["pid", "time", "level", "hostname", "name"].join(","),
            }
          : false,
      messageKey: "msg",
      timestamp: process.env.LOG_TIMESTAMP === "true",
      nestedKey: null,
      name: process.env.APP_NAME,
      level: process.env.LOG_LEVEL,
      formatters: {
        level: (level) => ({ level: level }),
      },
    },
    /**
     * Optional parameter for routing. It should implement interface of
     * parameters of NestJS buil-in `MiddlewareConfigProxy['forRoutes']`.
     * @see https://docs.nestjs.com/middleware#applying-middleware
     * It can be used for disabling automatic req/res logs (see above).
     * Keep in mind that it will remove context data from logs that are called
     * inside not included or excluded routes and controlles.
     */
    // forRoutes?: Parameters<MiddlewareConfigProxy["forRoutes"]>;

    /**
     * Optional parameter for routing. It should implement interface of
     * parameters of NestJS buil-in `MiddlewareConfigProxy['exclude']`.
     * @see https://docs.nestjs.com/middleware#applying-middleware
     * It can be used for disabling automatic req/res logs (see above).
     * Keep in mind that it will remove context data from logs that are called
     * inside not included or excluded routes and controlles.
     */
    exclude: ["healthy", "health/ready", "health/live"],
    /**
     * Optional parameter to skip `pino` configuration in case you are using
     * Fastify adapter, and already configuring it on adapter level.
     * Pros and cons of this approach are descibed in the last section.
     */
    useExisting: true,
    /**
     * Optional parameter to change property name `context` in resulted logs,
     * so logs will be like:
     * {"level":30, ... "RENAME_CONTEXT_VALUE_HERE":"AppController" }
     * Works with both `Logger` and `PinoLogger`
     */
    renameContext: process.env.LOG_CONTEXT_KEY || "context",
  })
);
