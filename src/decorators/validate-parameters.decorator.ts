import "reflect-metadata";
import { Inject, Type } from "@nestjs/common";
import { ValidationService } from "src/utils/services/validation.service";
import { PinoLogger } from "nestjs-pino";

const VALIDATED_METADATA_KEY = "parameters_to_be_validated";

interface ParameterInfo {
  parameterIndex: number;
  validateType: Type<any>;
}

export function Validate(validateType: Type<any>) {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const existingParametersToBeValidated = (Reflect.getOwnMetadata(
      VALIDATED_METADATA_KEY,
      target,
      propertyKey
    ) || []) as ParameterInfo[];
    existingParametersToBeValidated.push({ parameterIndex, validateType });
    Reflect.defineMetadata(
      VALIDATED_METADATA_KEY,
      existingParametersToBeValidated,
      target,
      propertyKey
    );
  };
}

export function ValidateParameters(
  options: {
    transform?: boolean;
  } = {}
): MethodDecorator {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Inject(PinoLogger)(target, "loggerService");
    // Get parameters decorated by @Validate decorator
    const parametersToBeValidated = Reflect.getOwnMetadata(
      VALIDATED_METADATA_KEY,
      target,
      propertyKey
    ) as ParameterInfo[];
    if (parametersToBeValidated.length) {
      const originalMethod = descriptor.value;
      descriptor.value = async function (...args: any[]) {
        try {
          for (const {
            parameterIndex,
            validateType,
          } of parametersToBeValidated) {
            args[parameterIndex] = await new ValidationService().validate(
              validateType,
              args[parameterIndex],
              options.transform
            );
          }
        } catch (err) {
          this.loggerService.setContext(target.constructor?.name);
          this.loggerService.error({
            type: "PARAMETER_VALIDATION_ERROR",
            msg: err.message || err,
          });
          throw new Error(err.message || err);
        }
        return await originalMethod.apply(this, args);
      };
    }
  };
}
