import { PopulateOptions } from "mongoose";

export class MongodbQueryOptions {
  skip?: number;
  limit?: number;
  sort?: string;
  populate?: string | string[] | PopulateOptions | PopulateOptions[];
  lean?: any;
  fields?: any;
}
