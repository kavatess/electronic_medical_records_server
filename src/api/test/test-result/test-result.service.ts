import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/hooks/database/base.service";
import { TestResult, TestResultDocument } from "./schemas/test-result.schema";

@Injectable()
export class TestResultService extends BaseService<TestResultDocument> {
  constructor(
    @InjectModel(TestResult.name)
    private readonly testResultModel: Model<TestResultDocument>
  ) {
    super(testResultModel);
  }
}
