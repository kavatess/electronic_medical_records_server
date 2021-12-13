import { PipeTransform, Injectable } from "@nestjs/common";
import flat from "flat";

@Injectable()
export class UnflattenPipe implements PipeTransform {
  transform(value: { [key: string]: any }): any {
    return flat.unflatten(value, { safe: true });
  }
}
