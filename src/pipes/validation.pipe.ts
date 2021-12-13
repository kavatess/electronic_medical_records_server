import {
  Injectable,
  ArgumentMetadata,
  PipeTransform,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(
    value: { [key: string]: any },
    metadata: ArgumentMetadata
  ): Promise<any> {
    // if (value instanceof Object && this.isEmpty(value)) {
    //   throw new HttpException(
    //     'Validation failed: No body submitted',
    //     HttpStatus.UNPROCESSABLE_ENTITY,
    //   );
    // }
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new HttpException(
        this.formatErrors(errors),
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }

  private formatErrors(errors: any[]) {
    return errors.reduce((custom, err) => {
      custom[err.property] = [];
      for (const property in err.constraints) {
        custom[err.property].push(err.constraints[property]);
      }
      return custom;
    }, {});
  }

  private isEmpty(value: { [key: string]: any }): boolean {
    if (Object.keys(value).length > 0) {
      return false;
    }
    return true;
  }
}
