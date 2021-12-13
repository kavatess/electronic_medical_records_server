import { applyDecorators } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";

export function ApiQueries(queries: string[]): any {
  const decorators: MethodDecorator[] = [];
  queries.forEach((query) => {
    if (query == "fields")
      decorators.push(ApiQuery({ name: query, type: String, required: false }));
    else if (query == "populate")
      decorators.push(ApiQuery({ name: query, type: String, required: false }));
    else if (query == "locale")
      decorators.push(
        ApiQuery({ name: query, enum: ["vi", "en"], required: false })
      );
    else if (query == "filter")
      decorators.push(ApiQuery({ name: query, type: String, required: false }));
    else if (query == "sort")
      decorators.push(ApiQuery({ name: query, type: String, required: false }));
    else if (query == "skip")
      decorators.push(ApiQuery({ name: query, type: Number, required: false }));
    else if (query == "limit")
      decorators.push(ApiQuery({ name: query, type: Number, required: false }));
    else if (query == "count")
      decorators.push(
        ApiQuery({ name: query, type: Boolean, required: false })
      );
    else decorators.push(ApiQuery({ name: query, required: false }));
  });
  return applyDecorators(...decorators);
}
