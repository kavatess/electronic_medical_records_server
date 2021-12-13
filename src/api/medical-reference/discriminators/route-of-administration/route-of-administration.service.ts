import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/hooks/database/base.service";
import { RouteOfAdministrationReferenceDocument } from "./schemas/route-of-administration.schema";

@Injectable()
export class RouteOfAdministrationReferenceService extends BaseService<RouteOfAdministrationReferenceDocument> {
  constructor(
    @InjectModel("routeOfAdministration")
    private readonly RouteOfAdministrationReferenceModel: Model<RouteOfAdministrationReferenceDocument>
  ) {
    super(RouteOfAdministrationReferenceModel);
  }
}
