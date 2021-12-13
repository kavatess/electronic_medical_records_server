import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";
import moment from "moment";

@Injectable()
export class ParseTimestampPipe implements PipeTransform<string, string> {
  transform(value: string, { type, data }: ArgumentMetadata): string {
    if (type === "custom" || !data) {
      throw new Error(
        "Error: Invalid argument metadata to use ParseTimestampPipe"
      );
    }
    if (Number(value) !== NaN) {
      return moment(Number(value)).toISOString();
    }
    return moment(value).toISOString();
  }
}
