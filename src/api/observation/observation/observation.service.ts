import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/hooks/database/base.service";
import { Observation, ObservationDocument } from "./schemas/observation.schema";

@Injectable()
export class ObservationService extends BaseService<ObservationDocument> {
  constructor(
    @InjectModel(Observation.name)
    private readonly observationModel: Model<ObservationDocument>
  ) {
    super(observationModel);
  }
}
