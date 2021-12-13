import { QueryOptions } from "mongoose";
import { BaseServiceOptions } from "src/models/base-service-options.model";

export interface QueryServiceOptions extends BaseServiceOptions {
  projections?: string;
  queryOptions?: QueryOptions;
  select?: string;
}
