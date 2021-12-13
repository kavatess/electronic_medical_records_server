import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/hooks/database/base.service";
import { HomeMonitoringObservationDocument } from "./schemas/home-monitoring.schema";

@Injectable()
export class HomeMonitoringObservationService extends BaseService<HomeMonitoringObservationDocument> {
  constructor(
    @InjectModel("home-monitoring")
    private readonly homeMonitoringObservationModel: Model<HomeMonitoringObservationDocument>
  ) {
    super(homeMonitoringObservationModel);
  }
}
