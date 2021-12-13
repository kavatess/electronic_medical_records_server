import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

export function IsNotEqualProperty(
  property: string,
  validationOptions?: ValidationOptions
) {
  return (object: any, propertyName: string) => {
    validationOptions = Object.assign(validationOptions || {}, {
      message: `${propertyName} must not equal to ${property}`,
    });
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsNotEqualPropertyConstraint,
    });
  };
}

@ValidatorConstraint({ name: "IsNotEqualProperty" })
class IsNotEqualPropertyConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [comparedPropertyName] = args.constraints;
    const comparedValue = (args.object as any)[comparedPropertyName];
    return value !== comparedValue;
  }
}
