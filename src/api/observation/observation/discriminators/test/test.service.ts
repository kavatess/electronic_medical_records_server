import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/hooks/database/base.service";
import { TestObservationDocument } from "./schemas/test.schema";

@Injectable()
export class TestObservationService extends BaseService<TestObservationDocument> {
  constructor(
    @InjectModel("test")
    private readonly testObservationModel: Model<TestObservationDocument>
  ) {
    super(testObservationModel);
  }
}
