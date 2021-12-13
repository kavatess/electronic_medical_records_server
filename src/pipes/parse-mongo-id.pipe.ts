import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";
import { ObjectId } from "bson";

@Injectable()
export class ParseMongoIdPipe implements PipeTransform<string, ObjectId> {
  transform(value: string, { type, data }: ArgumentMetadata): ObjectId {
    if (type === "custom" || !data) {
      throw new Error(
        "Error: Invalid argument metadata to use ParseMongoIdPipe"
      );
    }
    try {
      return new ObjectId(value);
    } catch (err) {
      throw new Error(
        `${
          type.charAt(0).toUpperCase() + type.slice(1)
        }(${data}) is not a mongoId`
      );
    }
  }
}
