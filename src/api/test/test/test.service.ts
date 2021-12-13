import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/hooks/database/base.service";
import { Test, TestDocument } from "./schemas/test.schema";

@Injectable()
export class TestService extends BaseService<TestDocument> {
  constructor(
    @InjectModel(Test.name)
    private readonly testModel: Model<TestDocument>
  ) {
    super(testModel);
  }
}
