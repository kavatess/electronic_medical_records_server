import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/hooks/database/base.service";
import { RxFrequencyReferenceDocument } from "./schemas/rx-frequency.schema";

@Injectable()
export class RxFrequencyReferenceService extends BaseService<RxFrequencyReferenceDocument> {
  constructor(
    @InjectModel("rxFrequency")
    private readonly RxFrequencyReferenceModel: Model<RxFrequencyReferenceDocument>
  ) {
    super(RxFrequencyReferenceModel);
  }
}
