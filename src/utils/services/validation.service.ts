import { Injectable, MethodNotAllowedException, Type } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

@Injectable()
export class ValidationService {
  async validate(type: Type<any>, value: any, transform = true): Promise<any> {
    if (this.isPrimitiveType(type) || this.isPrimitiveValue(value))
      return value;
    const object = plainToClass(type, value);
    const errors = await validate(object, { whitelist: true });
    if (errors.length > 0 || Object.keys(object).length === 0) {
      const errMsg = errors.map((err) => err.constraints || err.children);
      throw new MethodNotAllowedException(JSON.stringify(errMsg));
    }
    return transform ? object : value;
  }

  private isPrimitiveValue(value: any): boolean {
    return ["number", "boolean", "string"].includes(typeof value);
  }

  private isPrimitiveType(type: Type<any>): boolean {
    return [
      "String",
      "Number",
      "Boolean",
      "Object",
      "Function",
      "Array",
    ].includes(type.name);
  }
}
