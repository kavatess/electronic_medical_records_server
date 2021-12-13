import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ name: "ObjectValidator", async: false })
export class ObjectValidator implements ValidatorConstraintInterface {
  validate(obj: { [key: string]: any }, args: ValidationArguments): boolean {
    let valid = 1;
    for (const constraint of args.constraints) {
      // validate typeof value
      if (constraint.value) {
        for (const key in obj) {
          if (obj[key]) {
            const isTypeOf = typeof obj[key] === constraint.value;
            if (!isTypeOf) valid *= 0;
          } else if (constraint.required && !obj[key]) valid *= 0;
        }
      }
    }
    return !!valid;
  }

  defaultMessage(): string {
    return "object validator failed";
  }
}
