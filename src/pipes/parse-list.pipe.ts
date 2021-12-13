import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";

@Injectable()
export class ParseListPipe implements PipeTransform<string, string[]> {
  transform(value: string, { type, data }: ArgumentMetadata): string[] {
    if (type === "custom" || !data) {
      throw new Error("Error: Invalid argument metadata to use ParseListPipe");
    }
    if (!value || typeof value !== "string") return [];
    value = value.replace(/ /g, ",");
    return value
      .split(",")
      .map((str) => str.trim())
      .filter((str) => str);
  }
}
