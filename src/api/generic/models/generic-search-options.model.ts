import { MongodbQueryOptions } from "src/models/mongodb-query-options.model";

export class GenericSearchOptions extends MongodbQueryOptions {
  readonly filter?: Record<string, any>;
  readonly fields?: string[];
}
