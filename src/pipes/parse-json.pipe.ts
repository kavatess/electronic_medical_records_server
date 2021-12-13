import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";

@Injectable()
export class ParseJSONPipe
  implements PipeTransform<string, Record<string, any>>
{
  transform(
    value: string,
    { type, data }: ArgumentMetadata
  ): Record<string, any> {
    if (type === "custom" || !data) {
      throw new Error("Error: Invalid argument metadata to use ParseJSONPipe");
    }
    try {
      return JSON.parse(value);
    } catch (err) {
      throw new Error(`Error: Cannot parse ${value} to JSON`);
    }
  }
}
