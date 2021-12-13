import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/hooks/database/base.service";
import { ObservationReferenceDocument } from "./schemas/observation.schema";

@Injectable()
export class ObservationReferenceService extends BaseService<ObservationReferenceDocument> {
  constructor(
    @InjectModel("observation")
    private readonly ObservationReferenceModel: Model<ObservationReferenceDocument>
  ) {
    super(ObservationReferenceModel);
  }
}
