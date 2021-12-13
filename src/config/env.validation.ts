import { plainToClass } from "class-transformer";
import {
  IsBooleanString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  validateSync,
} from "class-validator";

enum Environment {
  Development = "development",
  Production = "production",
  Sandbox = "sandbox",
  Staging = "sandbox",
  Test = "test",
}

enum LogLevels {
  Fatal = "fatal",
  Error = "error",
  Warn = "warn",
  Info = "info",
  Debug = "debug",
  Trace = "trace",
}
class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  APP_PORT: number;

  @IsOptional()
  @IsEnum(LogLevels)
  LOG_LEVEL: LogLevels = LogLevels.Error;

  @IsOptional()
  @IsBooleanString()
  LOG_ENABLED = "true";

  @IsOptional()
  @IsBooleanString()
  LOG_PRETTY = "true";

  @Matches(new RegExp("^mongodb://"))
  MONGODB_URI: string;

  @IsString()
  MONGODB_USER: string;

  @IsString()
  MONGODB_PASS: string;

  @IsString()
  MONGODB_AUTHEN_SOURCE: string;

  @Matches(new RegExp("^amqp://"))
  RABBITMQ_URI: string;

  @IsOptional()
  @IsNumber()
  RABBITMQ_TIMEOUT: number;

  @IsString()
  AUTH_SECRET: string;

  @IsOptional()
  @IsBooleanString()
  AUTH_DISABLED: string;

  @IsOptional()
  @IsString()
  BASE: string;

  @IsOptional()
  @IsBooleanString()
  OPENAPI_SHOW: string;
}

export function validate(config: Record<string, unknown>): any {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
