import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./exceptions/all-exceptions.filter";
import { TransformInterceptor } from "./interceptors/transform.interceptors";
import { processRequest } from "./middlewares/process-request.middleware";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { UnflattenPipe } from "./pipes/unflatten.pipe";
import { Logger } from "nestjs-pino";
import { LoggingInterceptor } from "./interceptors/logger.interceptors";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(Logger));
  const configService = app.get(ConfigService);
  app.enableCors(configService.get("cors"));
  app.setGlobalPrefix(configService.get("app.base"));
  app.use(processRequest);
  app.useGlobalInterceptors(new LoggingInterceptor(configService));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter(configService));
  app.useGlobalPipes(new UnflattenPipe());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );
  const appPort = configService.get("app.port", 8080);
  if (configService.get<boolean>("openapi.show", true)) {
    const options = new DocumentBuilder()
      .addServer("http://localhost:" + appPort)
      .setContact("mHealth", "https://wellcare.vn", "xinchao@wellcare.vn")
      .setTitle("Consultation Server")
      .setDescription("The Consultation Server API description")
      .setVersion("1.0")
      .addSecurity("ApiKeyAuth", {
        type: "apiKey",
        in: "header",
        name: "token",
      })
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(
      configService.get("app.base", "") + "/openapi",
      app,
      document
    );
  }
  await app.listen(appPort);
}
bootstrap();
