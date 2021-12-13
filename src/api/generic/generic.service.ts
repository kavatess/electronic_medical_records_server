import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { GenericSearchOptions } from "./models/generic-search-options.model";

@Injectable()
export class GenericService {
  constructor(private readonly http: HttpService) {}

  async search(
    colName: string,
    { filter, fields, limit, skip, populate, sort }: GenericSearchOptions
  ): Promise<any[]> {
    const uri =
      `/${colName}/search?locale=vi` +
      `&filter=${JSON.stringify(filter || {})}` +
      `&populate=${JSON.stringify(populate || [])}` +
      `&limit=${limit || 100}` +
      `&skip=${skip || 0}` +
      `&sort=${sort || "createdAt"}` +
      (fields ? `&fields=${fields.join(",")}` : "");
    const response = await this.http.get(encodeURI(uri)).toPromise();
    return response.data.results;
  }
}
